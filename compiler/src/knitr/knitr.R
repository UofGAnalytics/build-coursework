args <- commandArgs(trailingOnly=TRUE)
fileName <- args[1]
cacheDir <- args[2]

knitr::opts_chunk$set(
  dev='svglite',
  fig.path=cacheDir,
  class.output='r-output'
)

knitr::knit(
  input=fileName,
  output='',
  quiet=TRUE
)
