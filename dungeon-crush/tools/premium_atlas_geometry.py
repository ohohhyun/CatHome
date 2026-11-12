"""Read-only atlas geometry. Authored FX rows can drift from a uniform grid."""
def cells(im,cols,rows,adaptive=False):
 cuts=[round(im.height*y/rows) for y in range(rows+1)]
 if adaptive:
  alpha=im.getchannel('A');pixels=list(alpha.getdata());mass=[sum(v>=100 for v in pixels[y*im.width:(y+1)*im.width]) for y in range(im.height)];radius=round(im.height/rows*.23)
  for row in range(1,rows):
   aim=cuts[row];candidates=range(max(cuts[row-1]+8,aim-radius),min(cuts[row+1]-8,aim+radius)+1)
   cuts[row]=min(candidates,key=lambda y:(sum(mass[max(0,y-3):min(im.height,y+3)]),abs(y-aim)))
 result=[]
 for row in range(rows):
  for col in range(cols):
   x=round(im.width*col/cols);x2=round(im.width*(col+1)/cols);result.append([x,cuts[row],x2-x,cuts[row+1]-cuts[row]])
 return result,cuts
