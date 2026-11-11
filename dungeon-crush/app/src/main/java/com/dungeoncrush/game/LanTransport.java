package com.dungeoncrush.game;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/** Phone-to-phone TCP. The host phone owns the simulation; no remote server. */
public final class LanTransport implements AutoCloseable {
 public interface Listener { void event(String kind,int peer,String body); }
 public static final int PORT=47655,MAX_PACKET=262144;
 private final Listener listener;
 private final ConcurrentMap<Integer,Peer> peers=new ConcurrentHashMap<>();
 private final AtomicInteger ids=new AtomicInteger(1);
 private final ExecutorService threads=Executors.newCachedThreadPool();
 private final Semaphore slots=new Semaphore(6);
 private volatile boolean closed;
 private volatile ServerSocket server;
 private volatile Socket pending;
 private String code;
 public LanTransport(Listener listener){this.listener=listener;}
 public String host() throws IOException {
  code=String.format(java.util.Locale.ROOT,"%04d",new SecureRandom().nextInt(10000));
  server=new ServerSocket();server.setReuseAddress(true);server.bind(new InetSocketAddress(PORT),6);
  threads.execute(()->{while(!closed){try{Socket s=server.accept();if(!slots.tryAcquire()){s.close();continue;}threads.execute(()->accept(s));}catch(IOException e){if(!closed)listener.event("error",0,"LAN 서버가 종료되었습니다.");break;}}});return code;
 }
 private void accept(Socket socket){try{
  socket.setSoTimeout(5000);socket.setTcpNoDelay(true);
  BufferedReader r=new BufferedReader(new InputStreamReader(socket.getInputStream(),StandardCharsets.UTF_8));
  BufferedWriter w=new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(),StandardCharsets.UTF_8));
  if(!("RIFT1 "+code).equals(line(r,32))){w.write("ERROR wrong code\n");w.flush();socket.close();return;}
  synchronized(peers){if(peers.size()>=3){w.write("ERROR room full\n");w.flush();socket.close();return;}
   int id=ids.getAndIncrement();w.write("WELCOME "+id+"\n");w.flush();socket.setSoTimeout(20000);
   Peer p=new Peer(id,socket,r,w);peers.put(id,p);listener.event("peer_joined",id,"");p.start();}
 }catch(Exception e){try{socket.close();}catch(IOException ignored){}}finally{slots.release();}}
 public void join(String address,String roomCode) throws IOException {
  Socket s=new Socket();pending=s;s.connect(new InetSocketAddress(address,PORT),5000);s.setSoTimeout(6000);s.setTcpNoDelay(true);
  if(closed){s.close();throw new IOException("Closed");}
  BufferedReader r=new BufferedReader(new InputStreamReader(s.getInputStream(),StandardCharsets.UTF_8));
  BufferedWriter w=new BufferedWriter(new OutputStreamWriter(s.getOutputStream(),StandardCharsets.UTF_8));
  w.write("RIFT1 "+roomCode+"\n");w.flush();String answer=line(r,128);
  if(answer==null||!answer.startsWith("WELCOME ")){s.close();throw new IOException("Join rejected");}
  int id=Integer.parseInt(answer.substring(8));s.setSoTimeout(20000);Peer p=new Peer(0,s,r,w);peers.put(0,p);pending=null;listener.event("connected",id,"");p.start();
 }
 public void send(String value){if(closed||value.length()>MAX_PACKET||value.indexOf('\n')>=0)return;for(Peer p:peers.values())p.offer(value);}
 private static String line(BufferedReader r,int limit) throws IOException {StringBuilder b=new StringBuilder();for(int c;(c=r.read())!=-1;){if(c=='\n')return b.toString();if(c!='\r')b.append((char)c);if(b.length()>limit)throw new IOException("Packet too large");}return b.length()==0?null:b.toString();}
 private final class Peer {
  final int id;final Socket socket;final BufferedReader reader;final BufferedWriter writer;
  final ArrayBlockingQueue<String> outgoing=new ArrayBlockingQueue<>(8);volatile boolean dead;
  Peer(int id,Socket s,BufferedReader r,BufferedWriter w){this.id=id;socket=s;reader=r;writer=w;}
  void offer(String s){if(!outgoing.offer(s)){outgoing.poll();outgoing.offer(s);}}
  void start(){threads.execute(()->{try{String s;while(!closed&&!dead&&(s=line(reader,MAX_PACKET))!=null)listener.event("packet",id,s);}catch(IOException ignored){}finally{drop();}});threads.execute(()->{try{while(!closed&&!dead){String s=outgoing.poll(2,TimeUnit.SECONDS);if(s!=null){writer.write(s);writer.newLine();writer.flush();}}}catch(Exception ignored){}finally{drop();}});}
  synchronized void drop(){if(dead)return;dead=true;peers.remove(id,this);try{socket.close();}catch(IOException ignored){}if(!closed)listener.event(server!=null?"peer_left":"disconnected",id,"연결이 종료되었습니다.");}
 }
 @Override public void close(){closed=true;try{if(server!=null)server.close();if(pending!=null)pending.close();}catch(IOException ignored){}for(Peer p:peers.values())p.drop();peers.clear();threads.shutdownNow();}
}
