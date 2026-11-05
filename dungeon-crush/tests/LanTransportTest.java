import com.dungeoncrush.game.LanTransport;
import java.util.*;
import java.util.concurrent.*;
import java.net.*;
import java.io.*;

public class LanTransportTest {
 static final BlockingQueue<String> hostEvents=new LinkedBlockingQueue<>();
 static void check(boolean b,String message){if(!b)throw new AssertionError(message);}
 static void await(BlockingQueue<String> q,String wanted) throws Exception {long end=System.nanoTime()+TimeUnit.SECONDS.toNanos(6);while(System.nanoTime()<end){String value=q.poll(100,TimeUnit.MILLISECONDS);if(value!=null&&value.contains(wanted))return;}throw new AssertionError("Event missing: "+wanted);}
 public static void main(String[]args) throws Exception {
  LanTransport host=new LanTransport((k,p,b)->hostEvents.offer(k+":"+p+":"+b));List<LanTransport> clients=new ArrayList<>();List<BlockingQueue<String>> events=new ArrayList<>();
  try{String code=host.host();check(code.matches("[0-9]{4}"),"4 digit pairing code");
   try(Socket s=new Socket("127.0.0.1",LanTransport.PORT)){s.setSoTimeout(2000);s.getOutputStream().write("RIFT1 wrong\n".getBytes());check(new BufferedReader(new InputStreamReader(s.getInputStream())).readLine().startsWith("ERROR"),"bad code rejected");}
   for(int i=0;i<3;i++){BlockingQueue<String> q=new LinkedBlockingQueue<>();events.add(q);LanTransport c=new LanTransport((k,p,b)->q.offer(k+":"+p+":"+b));clients.add(c);c.join("127.0.0.1",code);await(q,"connected:");}
   LanTransport fifth=new LanTransport((k,p,b)->{});boolean full=false;try{fifth.join("127.0.0.1",code);}catch(IOException e){full=true;}finally{fifth.close();}check(full,"four-player room capacity");
   clients.get(1).send("{\"type\":\"input\",\"x\":1,\"name\":\"린\"}");await(hostEvents,"\"type\":\"input\"");
   String snapshot="{\"type\":\"state\",\"players\":[0,1,2,3],\"text\":\"협동 원정\",\"padding\":\""+"x".repeat(30000)+"\"}";
   host.send(snapshot);for(BlockingQueue<String> q:events)await(q,"협동 원정");
   clients.get(0).close();await(hostEvents,"peer_left:");
   host.close();await(events.get(1),"disconnected:");
   System.out.println("PASS: native TCP handshake, invalid code, four-player capacity, UTF-8 input relay, 30KB state broadcast to three phones, client leave and host shutdown.");
  }finally{for(LanTransport c:clients)c.close();host.close();}
 }
}
