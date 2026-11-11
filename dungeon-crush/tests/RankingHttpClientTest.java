import com.dungeoncrush.game.RankingHttpClient;
import javax.net.ssl.HttpsURLConnection;
import java.net.*;
import java.io.*;
import java.util.*;
import java.security.cert.Certificate;
public class RankingHttpClientTest {
 static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
 static class Fake extends HttpsURLConnection {
  byte[] bytes="{\"entries\":[],\"total\":0}".getBytes(java.nio.charset.StandardCharsets.UTF_8);int status=200;String type="application/json";boolean disconnected;
  Fake()throws Exception{super(new URL("https://rank.example.test/v1/leaderboard"));}
  public String getCipherSuite(){return "TLS_TEST";}public Certificate[] getLocalCertificates(){return null;}public Certificate[] getServerCertificates(){return null;}public void disconnect(){disconnected=true;}public boolean usingProxy(){return false;}public void connect(){}public int getResponseCode(){return status;}public String getContentType(){return type;}public int getContentLength(){return -1;}public InputStream getInputStream(){return new ByteArrayInputStream(bytes);}
 }
 public static void main(String[] args)throws Exception{
  String endpoint="https://rank.example.test/v1/leaderboard",url=endpoint+"?metric=power&cls=-1&limit=50";Fake fake=new Fake();int[] requests={0};RankingHttpClient client=new RankingHttpClient(endpoint,u->{requests[0]++;return fake;});check(client.allows(url),"valid query");for(String bad:Arrays.asList("http://rank.example.test/v1/leaderboard?metric=power&cls=-1&limit=50",url.replace("rank.example.test","other.example.test"),url.replace("/v1/leaderboard","/other"),url.replace("cls=-1","cls=6"),url.replace("limit=50","limit=51"),url+"&secret=1",url+"&cls=1",url+"#fragment",url.replace("https://","https://name:pass@")))check(!client.allows(bad),"reject wrong endpoint/query");Map<String,String> headers=new HashMap<>();headers.put("Accept","application/json");headers.put("Authorization","Bearer short-session");check(client.get(url,headers,c->{}).contains("entries"),"JSON body");check(fake.disconnected,"connection closes");check(!fake.getInstanceFollowRedirects(),"no redirects");check("GET".equals(fake.getRequestMethod()),"read only");check("Bearer short-session".equals(fake.getRequestProperty("Authorization")),"runtime authorization");check(requests[0]==1,"one request");for(String key:Arrays.asList("Cookie","X-Other")){try{client.get(url,Collections.singletonMap(key,"x"),c->{});throw new AssertionError("header whitelist");}catch(IOException expected){}}check(requests[0]==1,"invalid headers never create request");fake.bytes=new byte[RankingHttpClient.MAX_BYTES+1];try{client.get(url,headers,c->{});throw new AssertionError("large response");}catch(IOException expected){check(expected.getMessage().equals("response_too_large"),"size bound");}fake.status=302;try{client.get(url,headers,c->{});throw new AssertionError("redirect rejected");}catch(IOException expected){}fake.status=200;fake.type="text/html";try{client.get(url,headers,c->{});throw new AssertionError("wrong type rejected");}catch(IOException expected){}System.out.println("PASS: native read-only HTTPS ranking transport, configured endpoint/query whitelist, runtime auth, no redirects, response size/type/status guards and connection cleanup; no real server requests.");
 }
}
