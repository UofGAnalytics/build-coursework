printsrc <- function(src, opts="") {
    if (nchar(opts)>0)
        opts <- paste0(" ", opts)
    src <- gsub("\n","\n    ",src, fixed=TRUE)
    paste0("    ```{r",opts,"}\n    ",src,"\n    ```")  
}

printinline <- function(src) {
    
    paste0("```\n `r ",src,"`\n```")  
}

printfile <- function(fn) {
    content <- paste0("    ",readLines(fn), collapse="\n")
    content
}

backtick <- "`"

