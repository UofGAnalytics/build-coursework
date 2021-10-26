args <- commandArgs(trailingOnly=TRUE)
fileName <- args[1]
baseDir <- args[2]
cacheDir <- args[3]
pythonBin <- args[4]

print(paste('pythonBin:', pythonBin))

knitr::opts_knit$set(root.dir=baseDir)

enginePaths <- list()
if (!is.na(pythonBin)) {
  print('python not NA')
  c(enginePaths, python=pythonBin)
}

knitr::opts_chunk$set(
  dev='svglite',
  class.output='knitr-output',
  fig.path=cacheDir,
  engine.path=enginePaths
)

knitr::knit(
  input=fileName,
  output='',
  quiet=TRUE
)
