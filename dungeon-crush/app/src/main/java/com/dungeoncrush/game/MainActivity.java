package com.dungeoncrush.game;
import android.app.Activity;
import android.os.Bundle;
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
import java.util.concurrent.*;

public class MainActivity extends Activity {
 private WebView game;private volatile LanTransport lan;private volatile boolean destroyed;
 private final ExecutorService connections=Executors.newSingleThreadExecutor();
 @Override public void onCreate(Bundle state){super.onCreate(state);getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);immersive();
  game=new WebView(this);game.setBackgroundColor(0xff101218);WebSettings s=game.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setSupportZoom(false);
  game.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return true;}@Override public boolean shouldOverrideUrlLoading(WebView v,String u){return true;}});
  game.addJavascriptInterface(new Bridge(),"RiftNative");setContentView(game);game.loadUrl("file:///android_asset/index.html");
 }
 private void immersive(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE);}
 private void event(String kind,int peer,String body){if(destroyed)return;try{JSONObject v=new JSONObject();v.put("kind",kind);v.put("peer",peer);if("packet".equals(kind))v.put("body",new JSONObject(body));else v.put("message",body);final String json=v.toString();runOnUiThread(()->{if(!destroyed)game.evaluateJavascript("window.onNativeEvent&&window.onNativeEvent("+json+")",null);});}catch(Exception ignored){}}
 private String ip(){String fallback="";try{Enumeration<NetworkInterface> all=NetworkInterface.getNetworkInterfaces();while(all.hasMoreElements()){NetworkInterface n=all.nextElement();if(!n.isUp()||n.isLoopback())continue;Enumeration<InetAddress> aa=n.getInetAddresses();while(aa.hasMoreElements()){InetAddress a=aa.nextElement();if(a instanceof Inet4Address&&a.isSiteLocalAddress()){if(n.getName().startsWith("wlan")||n.getName().startsWith("ap"))return a.getHostAddress();fallback=a.getHostAddress();}}}}catch(Exception ignored){}return fallback;}
 public final class Bridge {
  @JavascriptInterface public String loadProgress(){return getSharedPreferences("rift-rpg",MODE_PRIVATE).getString("save","");}
  @JavascriptInterface public boolean saveProgress(String value){if(value==null||value.length()>2000000)return false;try{JSONObject parsed=new JSONObject(value);if(parsed.optInt("version")!=2)return false;return getSharedPreferences("rift-rpg",MODE_PRIVATE).edit().putString("save",value).commit();}catch(Exception e){return false;}}
  @JavascriptInterface public String localIp(){return ip();}
  @JavascriptInterface public void host(){connections.execute(()->{stopLan();try{LanTransport f=new LanTransport((k,p,b)->event(k,p,b));lan=f;String code=f.host();event("hosting",0,ip()+"|"+code);}catch(Exception e){event("error",0,"방을 열지 못했습니다. Wi-Fi 연결과 실행 중인 방을 확인하세요.");}});}
  @JavascriptInterface public void join(String address,String code){if(!address.matches("(?:[0-9]{1,3}\\.){3}[0-9]{1,3}")||!code.matches("[0-9]{4}")){event("error",0,"방장 IP와 4자리 코드를 확인하세요.");return;}connections.execute(()->{stopLan();try{LanTransport f=new LanTransport((k,p,b)->event(k,p,b));lan=f;f.join(address,code);}catch(Exception e){stopLan();event("error",0,"접속 실패: 같은 Wi-Fi, 방장 IP, 코드와 공유기 기기 간 통신 설정을 확인하세요.");}});}
  @JavascriptInterface public void send(String packet){LanTransport current=lan;if(current!=null&&packet.length()<262144)current.send(packet);}
  @JavascriptInterface public void disconnect(){connections.execute(()->stopLan());}
  @JavascriptInterface public void vibrate(){runOnUiThread(()->{if(!destroyed)game.performHapticFeedback(android.view.HapticFeedbackConstants.KEYBOARD_TAP);});}
 }
 private synchronized void stopLan(){if(lan!=null){lan.close();lan=null;}}
 @Override protected void onPause(){game.evaluateJavascript("window.appPause&&window.appPause()",null);stopLan();game.onPause();super.onPause();}
 @Override protected void onResume(){super.onResume();if(game!=null)game.onResume();immersive();}
 @Override public void onBackPressed(){game.evaluateJavascript("window.appBack&&window.appBack()",null);}
 @Override public void onWindowFocusChanged(boolean focus){super.onWindowFocusChanged(focus);if(focus)immersive();}
 @Override protected void onDestroy(){destroyed=true;stopLan();connections.shutdownNow();game.removeJavascriptInterface("RiftNative");game.destroy();super.onDestroy();}
}
