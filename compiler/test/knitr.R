args <- commandArgs(trailingOnly=TRUE)
fileName <- args[1]

opts_chunk$set(
    dev='svglite'
)

knitr::knit(input=fileName, output='')