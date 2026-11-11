package com.dungeoncrush.game;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/** Optional, read-only ranking transport; never called when config is disabled. */
public final class RankingHttpClient {
 public interface Factory { HttpsURLConnection open(URL url) throws IOException; }
 public interface ConnectionObserver { void opened(HttpsURLConnection connection); }
 public static final int MAX_BYTES=262144;
 private final URI endpoint; private final Factory factory;
 public RankingHttpClient(String endpoint){this(endpoint,url->(HttpsURLConnection)url.openConnection());}
 public RankingHttpClient(String value,Factory factory){try{this.endpoint=new URI(value);if(!"https".equalsIgnoreCase(endpoint.getScheme())||endpoint.getHost()==null||endpoint.getUserInfo()!=null||endpoint.getRawQuery()!=null||endpoint.getFragment()!=null)throw new IllegalArgumentException("Invalid ranking endpoint");}catch(URISyntaxException e){throw new IllegalArgumentException("Invalid ranking endpoint",e);}this.factory=factory;}
 public boolean allows(String value){try{URI target=new URI(value);if(!"https".equalsIgnoreCase(target.getScheme())||target.getUserInfo()!=null||target.getFragment()!=null||!endpoint.getHost().equalsIgnoreCase(target.getHost())||port(endpoint)!=port(target)||!path(endpoint).equals(path(target)))return false;Map<String,String> query=new HashMap<>();String raw=target.getRawQuery();if(raw==null)return false;for(String part:raw.split("&")){String[] kv=part.split("=",2);if(kv.length!=2||query.put(kv[0],kv[1])!=null)return false;}return query.size()==3&&Arrays.asList("power","growth","rift","clears","arena").contains(query.get("metric"))&&query.get("cls")!=null&&query.get("cls").matches("-1|[0-5]")&&query.get("limit")!=null&&Integer.parseInt(query.get("limit"))>=1&&Integer.parseInt(query.get("limit"))<=50;}catch(Exception e){return false;}}
 private String path(URI uri){String value=uri.getRawPath();return value==null||value.isEmpty()?"/":value;}
 private int port(URI uri){return uri.getPort()<0?443:uri.getPort();}
 public String get(String url,Map<String,String> headers,ConnectionObserver observer) throws IOException {
  if(!allows(url))throw new IOException("invalid_endpoint");
  for(Map.Entry<String,String> entry:headers.entrySet())if(!Arrays.asList("Accept","apikey","Authorization").contains(entry.getKey())||entry.getValue()==null||entry.getValue().length()>8192||entry.getValue().contains("\r")||entry.getValue().contains("\n"))throw new IOException("invalid_headers");
  HttpsURLConnection connection=factory.open(new URL(url));
  try{observer.opened(connection);connection.setRequestMethod("GET");connection.setInstanceFollowRedirects(false);connection.setConnectTimeout(5000);connection.setReadTimeout(5000);connection.setUseCaches(false);for(Map.Entry<String,String> entry:headers.entrySet())connection.setRequestProperty(entry.getKey(),entry.getValue());int status=connection.getResponseCode();if(status!=200)throw new IOException(status==401||status==403?"unauthorized":status==429?"rate_limited":"unavailable");String type=connection.getContentType();if(type==null||!type.toLowerCase(Locale.ROOT).contains("application/json"))throw new IOException("invalid_response");if(connection.getContentLength()>MAX_BYTES)throw new IOException("response_too_large");try(InputStream in=connection.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] buffer=new byte[8192];int n;while((n=in.read(buffer))!=-1){if(Thread.currentThread().isInterrupted())throw new IOException("aborted");if(out.size()+n>MAX_BYTES)throw new IOException("response_too_large");out.write(buffer,0,n);}return new String(out.toByteArray(),StandardCharsets.UTF_8);}}finally{connection.disconnect();}
 }
}
