package com.dungeoncrush.game;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import java.io.*;
import java.nio.charset.StandardCharsets;
import android.os.Bundle;
import android.os.Build;
import android.view.WindowInsets;
import android.graphics.Insets;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import org.json.JSONObject;
import java.net.*;
import java.util.Enumeration;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.*;

public class MainActivity extends Activity {
 private static final int EXPORT_BACKUP=401,IMPORT_BACKUP=402;
 private String pendingBackup;
 private RankingHttpClient rankingClient;
 private final ExecutorService rankingRequests=Executors.newFixedThreadPool(2);
 private static final class RankingCall {volatile boolean cancelled;volatile javax.net.ssl.HttpsURLConnection connection;}
 private final ConcurrentMap<String,RankingCall> rankingCalls=new ConcurrentHashMap<>();
 private WebView game;private volatile LanTransport lan;private volatile boolean destroyed;
 private final ExecutorService connections=Executors.newSingleThreadExecutor();
 @Override public void onCreate(Bundle state){super.onCreate(state);getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);immersive();
  try(InputStream in=getAssets().open("ranking-config.js");ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] bytes=new byte[1024];int n;while((n=in.read(bytes))!=-1)out.write(bytes,0,n);String source=new String(out.toByteArray(),StandardCharsets.UTF_8);JSONObject config=new JSONObject(source.substring(source.indexOf('{'),source.lastIndexOf('}')+1));if(config.optBoolean("enabled",false))rankingClient=new RankingHttpClient(config.getString("endpoint"));}catch(Exception ignored){rankingClient=null;}
  game=new WebView(this);game.setBackgroundColor(0xff101218);WebSettings s=game.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setSupportZoom(false);
  game.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return true;}@Override public boolean shouldOverrideUrlLoading(WebView v,String u){return true;}});
  game.setOnApplyWindowInsetsListener((view,insets)->{int left,top,right,bottom;if(Build.VERSION.SDK_INT>=30){Insets safe=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());left=safe.left;top=safe.top;right=safe.right;bottom=safe.bottom;}else{left=insets.getSystemWindowInsetLeft();top=insets.getSystemWindowInsetTop();right=insets.getSystemWindowInsetRight();bottom=insets.getSystemWindowInsetBottom();if(Build.VERSION.SDK_INT>=28&&insets.getDisplayCutout()!=null){left=Math.max(left,insets.getDisplayCutout().getSafeInsetLeft());top=Math.max(top,insets.getDisplayCutout().getSafeInsetTop());right=Math.max(right,insets.getDisplayCutout().getSafeInsetRight());bottom=Math.max(bottom,insets.getDisplayCutout().getSafeInsetBottom());}}view.setPadding(left,top,right,bottom);return insets;});
  if(Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,()->onBackPressed());
  game.addJavascriptInterface(new Bridge(),"RiftNative");setContentView(game);game.loadUrl("file:///android_asset/index.html");
 }
 private void immersive(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE);}
 private void event(String kind,int peer,String body){if(destroyed)return;try{JSONObject v=new JSONObject();v.put("kind",kind);v.put("peer",peer);if("packet".equals(kind))v.put("body",new JSONObject(body));else v.put("message",body);final String json=v.toString();runOnUiThread(()->{if(!destroyed)game.evaluateJavascript("window.onNativeEvent&&window.onNativeEvent("+json+")",null);});}catch(Exception ignored){}}
 private String ip(){String fallback="";try{Enumeration<NetworkInterface> all=NetworkInterface.getNetworkInterfaces();while(all.hasMoreElements()){NetworkInterface n=all.nextElement();if(!n.isUp()||n.isLoopback())continue;Enumeration<InetAddress> aa=n.getInetAddresses();while(aa.hasMoreElements()){InetAddress a=aa.nextElement();if(a instanceof Inet4Address&&a.isSiteLocalAddress()){if(n.getName().startsWith("wlan")||n.getName().startsWith("ap"))return a.getHostAddress();fallback=a.getHostAddress();}}}}catch(Exception ignored){}return fallback;}
 public final class Bridge {
  @JavascriptInterface public String loadProgress(){return getSharedPreferences("rift-rpg",MODE_PRIVATE).getString("save","");}
  @JavascriptInterface public String loadProgressBackup(){return getSharedPreferences("rift-rpg",MODE_PRIVATE).getString("backup","");}
  @JavascriptInterface public boolean saveProgress(String value){if(value==null||value.length()>2000000)return false;try{JSONObject parsed=new JSONObject(value);if(!validProgress(parsed))return false;SharedPreferences prefs=getSharedPreferences("rift-rpg",MODE_PRIVATE);SharedPreferences.Editor edit=prefs.edit();String previous=prefs.getString("save",""),previousBackup=prefs.getString("backup","");if(!previous.equals(value)&&validProgress(previous))edit.putString("backup",previous);boolean committed=edit.putString("save",value).commit();if(!committed)prefs.edit().putString("save",previous).putString("backup",previousBackup).commit();return committed;}catch(Exception e){return false;}}
  @JavascriptInterface public void exportBackup(String text,String name){if(text==null||text.length()>2000000)return;runOnUiThread(()->{if(destroyed||pendingBackup!=null)return;pendingBackup=text;try{Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);intent.addCategory(Intent.CATEGORY_OPENABLE);intent.setType("application/json");intent.putExtra(Intent.EXTRA_TITLE,name!=null&&name.matches("[A-Za-z0-9_.-]{1,100}")?name:"DungeonCrush-backup.json");startActivityForResult(intent,EXPORT_BACKUP);}catch(Exception e){pendingBackup=null;backupEvent("error","파일 저장 화면을 열지 못했습니다.");}});}
  @JavascriptInterface public void importBackup(){runOnUiThread(()->{if(destroyed)return;try{Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT);intent.addCategory(Intent.CATEGORY_OPENABLE);intent.setType("*/*");startActivityForResult(intent,IMPORT_BACKUP);}catch(Exception e){backupEvent("error","파일 선택 화면을 열지 못했습니다.");}});}
  @JavascriptInterface public void requestExit(){runOnUiThread(()->{if(!destroyed)new AlertDialog.Builder(MainActivity.this).setMessage("던전크러시를 종료할까요?").setPositiveButton("종료",(dialog,which)->finish()).setNegativeButton("취소",null).show();});}
  @JavascriptInterface public void requestRanking(String id,String url,String headerJson){if(id==null||!id.matches("[A-Za-z0-9_-]{1,80}")||destroyed)return;if(rankingClient==null){rankingResult(id,null,"disabled");return;}if(url==null||url.length()>4096||headerJson==null||headerJson.length()>16384||rankingCalls.size()>=8){rankingResult(id,null,"invalid_request");return;}RankingCall call=new RankingCall();if(rankingCalls.putIfAbsent(id,call)!=null){rankingResult(id,null,"invalid_request");return;}rankingRequests.execute(()->{try{if(call.cancelled)return;JSONObject object=new JSONObject(headerJson);Map<String,String> headers=new HashMap<>();java.util.Iterator<String> keys=object.keys();while(keys.hasNext()){String key=keys.next();headers.put(key,object.getString(key));}String response=rankingClient.get(url,headers,connection->{call.connection=connection;if(call.cancelled)throw new IllegalStateException("Ranking request cancelled");});if(!call.cancelled)rankingResult(id,response,null);}catch(Exception e){if(!call.cancelled)rankingResult(id,null,"request_failed");}finally{rankingCalls.remove(id);}});}
  @JavascriptInterface public void cancelRanking(String id){if(id==null)return;RankingCall call=rankingCalls.get(id);if(call!=null){call.cancelled=true;if(call.connection!=null)call.connection.disconnect();}}
  @JavascriptInterface public String localIp(){return ip();}
  @JavascriptInterface public void host(){connections.execute(()->{stopLan();try{LanTransport f=new LanTransport((k,p,b)->event(k,p,b));lan=f;String code=f.host();event("hosting",0,ip()+"|"+code);}catch(Exception e){event("error",0,"방을 열지 못했습니다. Wi-Fi 연결과 실행 중인 방을 확인하세요.");}});}
  @JavascriptInterface public void join(String address,String code){if(address==null||code==null||!address.matches("(?:[0-9]{1,3}\\.){3}[0-9]{1,3}")||!code.matches("[0-9]{4}")){event("error",0,"방장 IP와 4자리 코드를 확인하세요.");return;}connections.execute(()->{stopLan();try{LanTransport f=new LanTransport((k,p,b)->event(k,p,b));lan=f;f.join(address,code);}catch(Exception e){stopLan();event("error",0,"접속 실패: 같은 Wi-Fi, 방장 IP, 코드와 공유기 기기 간 통신 설정을 확인하세요.");}});}
  @JavascriptInterface public void send(String packet){LanTransport current=lan;if(current!=null&&packet!=null&&packet.length()<262144)current.send(packet);}
  @JavascriptInterface public void disconnect(){connections.execute(()->stopLan());}
  @JavascriptInterface public void vibrate(){runOnUiThread(()->{if(!destroyed)game.performHapticFeedback(android.view.HapticFeedbackConstants.KEYBOARD_TAP);});}
 }
 private void rankingResult(String id,String response,String error){if(destroyed)return;runOnUiThread(()->{if(destroyed)return;try{JSONObject event=new JSONObject();event.put("id",id);if(error!=null)event.put("error",error);else event.put("text",response);game.evaluateJavascript("window.onRankingHttpResult&&window.onRankingHttpResult("+event.toString()+")",null);}catch(Exception ignored){}});}
 private boolean nonnegativeNumber(Object value){if(!(value instanceof Number))return false;double number=((Number)value).doubleValue();return !Double.isNaN(number)&&!Double.isInfinite(number)&&number>=0;}
 private boolean validProgress(JSONObject o){try{if(o.optInt("version")!=2||!nonnegativeNumber(o.opt("gold"))||!nonnegativeNumber(o.opt("revision"))||o.optJSONArray("chars")==null||o.optJSONArray("chars").length()!=6)return false;for(int i=0;i<6;i++){JSONObject character=o.getJSONArray("chars").getJSONObject(i);if(!nonnegativeNumber(character.opt("xp"))||character.optJSONArray("items")==null||character.getJSONArray("items").length()>220)return false;for(int j=0;j<character.getJSONArray("items").length();j++){JSONObject item=character.getJSONArray("items").getJSONObject(j);double id=item.optDouble("id");if(!nonnegativeNumber(item.opt("id"))||id<=0||id!=Math.rint(id)||id>9007199254740991d)return false;}}return true;}catch(Exception e){return false;}}
 private boolean validProgress(String value){try{return validProgress(new JSONObject(value));}catch(Exception e){return false;}}
 private void backupEvent(String kind,String value){if(destroyed)return;runOnUiThread(()->{if(!destroyed)try{JSONObject event=new JSONObject();event.put("kind",kind);event.put("import".equals(kind)?"text":"message",value);game.evaluateJavascript("window.onBackupEvent&&window.onBackupEvent("+event.toString()+")",null);}catch(Exception ignored){}});}
 @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request!=EXPORT_BACKUP&&request!=IMPORT_BACKUP)return;String text=pendingBackup;if(request==EXPORT_BACKUP)pendingBackup=null;if(result!=RESULT_OK||data==null||data.getData()==null)return;final android.net.Uri uri=data.getData();connections.execute(()->{try{if(request==EXPORT_BACKUP){if(text==null)throw new IOException();try(OutputStream out=getContentResolver().openOutputStream(uri,"wt")){if(out==null)throw new IOException();out.write(text.getBytes(StandardCharsets.UTF_8));}backupEvent("export","");}else{try(InputStream in=getContentResolver().openInputStream(uri);ByteArrayOutputStream out=new ByteArrayOutputStream()){if(in==null)throw new IOException();byte[] buffer=new byte[8192];int n;while((n=in.read(buffer))!=-1){if(out.size()+n>2000000)throw new IOException();out.write(buffer,0,n);}backupEvent("import",new String(out.toByteArray(),StandardCharsets.UTF_8));}}}catch(Exception e){backupEvent("error","파일을 처리하지 못했습니다. 2MB 이하의 던전크러시 백업 파일인지 확인하세요.");}});}
 private synchronized void stopLan(){if(lan!=null){lan.close();lan=null;}}
 @Override protected void onPause(){game.evaluateJavascript("window.appPause&&window.appPause()",null);stopLan();game.onPause();super.onPause();}
 @Override protected void onResume(){super.onResume();if(game!=null){game.onResume();game.evaluateJavascript("window.appResume&&window.appResume()",null);}immersive();}
 @Override public void onBackPressed(){game.evaluateJavascript("window.appBack&&window.appBack()",null);}
 @Override public void onWindowFocusChanged(boolean focus){super.onWindowFocusChanged(focus);if(focus)immersive();}
 @Override protected void onDestroy(){destroyed=true;stopLan();connections.shutdownNow();rankingRequests.shutdownNow();for(RankingCall call:rankingCalls.values()){call.cancelled=true;if(call.connection!=null)call.connection.disconnect();}rankingCalls.clear();game.removeJavascriptInterface("RiftNative");game.destroy();super.onDestroy();}
}
