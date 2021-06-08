yl93<- read.csv(url("http://www.stats.gla.ac.uk/~tereza/rp/yl93.csv"))
yl <- subset(yl93, Hear%in%c("Yanny","Laurel"))
dim(yl)
yl$Hear <- factor(yl$Hear)

library(ggplot2)

yl.plot1 <- ggplot(yl, aes(y=Age, x=Hear)) 

yl.plot1 + geom_boxplot()+ xlab("What do you hear?") +
  theme(panel.background = element_rect(fill = "transparent", colour = NA),
        plot.background = element_rect(fill = "transparent", colour = NA),
        panel.border = element_rect(fill = NA, colour = "black", size = 1))

library(sjPlot)
sjp.xtab(yl$Hear,yl$Gender, show.values = FALSE, show.total = FALSE, 
         axis.labels = c("Laurel", "Yanny"), 
         axis.titles=c("What do you hear?"))


mod.yl <- glm(Hear ~ Age, family=binomial, data=yl)
summary(mod.yl)