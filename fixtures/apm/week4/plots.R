## Latent variables 

d <- data.frame(x= seq(from=-3,to=3, length=500))
d$y <- dnorm(d$x)
d$p1 <- (d$x< -1)*d$y
d$p2 <- (-1< d$x)* (d$x< 0)* d$y
d$p3 <- ( 0< d$x)* (d$x< 2)* d$y
d$p4 <- ( 2< d$x)* d$y

dlab1 <- data.frame(p = c("p[1]", "p[2]", "p[3]","p[4]"), 
                   x =  c(-1.75, -0.5, 1 , 2.5), y = rep(0.01,4))

dlab2 <- data.frame(c = c("C[1]", "C[2]","C[3]"), 
                    x =  c(-1, 0, 2), y = rep(-0.02,3))

ggplot(d, aes(x=d$x, y=d$y)) + 
    geom_line(color="black",size=1) +
    geom_area(aes(y = d$p1, fill="p1")) +
    geom_area(aes(y = d$p2, fill="p2")) +
    geom_area(aes(y = d$p3, fill="p3")) +
    geom_area(aes(y = d$p4, fill="p4")) +
    geom_text(data = dlab1, aes(x=x, y=y, label=p), parse = TRUE, color = 'red', family="Cambria Math", size=6) +
    geom_text(data = dlab2, aes(x=x, y=y, label=c), parse = TRUE, family="Cambria Math",size=6) +
    scale_fill_brewer(palette= "Greys")  + 
    theme(legend.position="none") +
    theme_update(axis.text = element_blank(), 
                 axis.title = element_blank(),
                 panel.border = element_blank(),
                 panel.grid = element_blank(), 
                 legend.position = "none", 
                 axis.line=element_blank(),
                 axis.text.x=element_blank(),
                 axis.text.y=element_blank(),
                 axis.ticks=element_blank(),
                 axis.title.x=element_blank(),        
                 axis.title.y=element_blank())






## Proportional odds 
    
    par(mar=c(0,0,0,0))

    x <- seq(from=0, to =1,length=100)
    y1 <- 1+2*x
    y2 <- 2+2*x
    y3 <- 3+2*x
    plot(x,y3, type="l", xaxt="n",yaxt="n", xlab="", ylab="",ylim=c(-1,7.5),xlim=c(-0.1,1.1), ax=FALSE)
    mtext(expression(bold("x")),side=1,line=-3)
    mtext(expression(bold("Log odds")),side=2,line=-1.5)
    axis(1, labels = FALSE, pos=0,lwd.tick=0)
    axis(2, labels = FALSE, pos=0,lwd.tick=0)
    lines(x,y2)
    lines(x,y1)
    text(x=0,y=1, pos=2, expression(beta["03"]))
    text(x=0,y=2, pos=2, expression(beta["02"]))
    text(x=0,y=3, pos=2, expression(beta["01"]))
    text(x=1,y=3, pos=4, expression(italic("j=3")))
    text(x=1,y=4, pos=4, expression(italic("j=2")))
    text(x=1,y=5, pos=4, expression(italic("j=1")))











p = ggplot(data.frame(x=1,y=1,label="alpha")) 

p + geom_text(aes(x,y,label=label))

## use the parse argument to interpret the plotmath expression
 p + geom_text(aes(x,y,label=label), parse=TRUE)


delta     <- 0.001 
quantiles <- 2
z.df     <- data.frame(x = seq(from=-3, to=3, by=delta))
z.df$pdf <- dnorm(z.df$x)
z.df$p1  <- 
    
    ggplot(z.df,aes(x=x,y=pdf))+
    geom_area(aes(x=x,y=pdf,group=qt,fill=qt),color="black")

+
    scale_fill_gradient2(midpoint=median(unique(z.df$qt)), guide="none") +
    theme_bw()



plot(xxx, yyy, type="l", xaxt="n",yaxt="n", xlab="", ylab="", ax=FALSE,ylim=c(-0.05,0.5))
abline(h=0)
lines(x=c(2,2),y=c(0,dnorm(2)))
lines(x=c(-1,-1),y=c(0,dnorm(-1)))
lines(x=c(0,0),y=c(0,dnorm(0)))

text(x=-1,y=0.01,pos=1, expression(C[1]))
text(x=0,y=0.01,pos=1, expression(C[2]))
text(x=2,y=0.01,pos=1, expression(C[3]))

text(x=-1.5,y=0.05, expression(p[1]))
text(x=-0.5,y=0.05, expression(p[2]))
text(x=1,y=0.05, expression(p[3]))
text(x=2.3,y=0.02, expression(p[4])) 