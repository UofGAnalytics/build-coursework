This tool converts ODL courses written as .Rmd and .yaml files, to accessible HTML and PDF documents.

## Installation

The easiest way to install Node.js is to first install a command line tool called Node Version Manager.

### Install NVM

#### On Windows

Follow installation instructions on the [coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) project.

#### On Mac or Linux

Follow installation instructions on the [nvm-sh/nvm](https://github.com/nvm-sh/nvm#installing-and-updating) project.

Next, you need to run a few terminal commands. If you are unfamiliar with this, here is a quick tutorial on how to open a terminal on [Mac](https://www.howtogeek.com/682770/how-to-open-the-terminal-on-a-mac) and [Windows](https://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10#opencommandpromptfromsearch).

### Install Node.js

Run the following commands to install the [latest LTS version of Node.js](https://nodejs.org) (currently 16.15.0):

```bash
nvm install 16.15.0
nvm use 16.15.0
```

To check everything installed correctly, run the following:

```bash
node –v
# v16.15.0 or similar
```

Node Package Manager (npm) should automatically be installed:

```bash
npm –v
# 8.5.5 or similar
```

Since npm version 8.5.2, there is a niche bug affecting [installing Github packages globally](https://github.com/npm/cli/issues/3692), which is what we're about to do, so please rollback npm version 8.5.1 for now:

```bash
npm install -g npm@8.5.1
npm audit fix # automatically fix the vulnerability found by dependabot
npm –v
# 8.5.1
```

### Ensure Git is installed

```bash
git --version
# git version 2.30.1 (Apple Git-130) or similar
```

If not, please follow the instructions here: https://docs.github.com/en/get-started/quickstart/set-up-git.

### Ensure Rscript is callable from the terminal

```bash
Rscript --version
# R scripting front-end version 4.1.0 (2021-05-18) or similar
```

If not, please follow these instructions for [Windows](https://info201.github.io/r-intro.html#windows-command-line) or these for [Mac and Linux](https://stackoverflow.com/questions/38456144/rscript-command-not-found#67086041)

### Install this project from GitHub with npm

```bash
npm install -g UofGAnalytics/build-coursework
```

Ensure it works correctly:

```bash
npm list –g
> ...
> build-coursework@... -> ...github:UofGAnalytics/build-coursework...
> ...

rmarkdown --version
# 1.1.47 or similar
```

### R packages

If you have a clean R installation you might have to install some additional packages. The required packages are:

- knitr, svglite

And if you are compiling Python notes:

- reticulate

### Python environment

If you are hoping to run python code inside RMarkdown using this tool, please follow the [python anaconda](docs/python-anaconda/readme.md) guide.

## Usage

In your terminal, navigate to a coursework folder with a `course.yaml` file, for example:

```bash
cd /Users/staff/my-course/coursematerial
```

> If you would like to create a new coursework project from scratch, please look at the minimal [fixtures/basic](https://github.com/UofGAnalytics/build-coursework/tree/master/fixtures/basic) project structure.

Run the program:

```bash
# compile the whole course (may take a while)
rmarkdown

# compile just week 1
rmarkdown --week=1

# compile just HTML version for week 1
rmarkdown --noPdf --week=1

# compile the course using a custom Python version
rmarkdown --pythonBin="/opt/homebrew/bin/python3"
```

Once complete, you will find a `build` folder in beside the `course.yaml` file, with the .html and/or .pdf files inside. You can open the .html files with a web browser such as Chrome or Firefox.

> Each time you re-run the command (press the up arrow and enter to quickly re-run your previous command in the terminal) the previous file(s) will be overwritten, and you can refresh your browser window to see the changes.

> If you are used to using RStudio, you can use the Terminal tab there to run the `rmarkdown` command if you prefer.

### Update

One day you may run the `rmarkdown` command and see a message like this:

```
> You are running version 1.0.0 and the latest version is 1.5.0.
> Run the following command to update:
> npm install -g UofGAnalytics/build-coursework@v1.5.0
```

If you would like to update to the latest version, just run the command that is suggested.

### Options

| Argument  | Type      | Description                                                                   |
| :-------- | :-------- | :---------------------------------------------------------------------------- |
| week      | _number_  | Build specific week (1-based index)                                           |
| noHtml    | _boolean_ | Don't compile to HTML                                                         |
| noPdf     | _boolean_ | Don't compile to PDF                                                          |
| spelling  | _boolean_ | Run spell checker (opt-in as so many false negatives but can still be useful) |
| pythonBin | _string_  | Override the absolute path to the Python binary                               |
| force     | _boolean_ | Compile even with fatal errors (can be useful for debugging)                  |

### Reporting

I perform various static analysis on the coursework and report any problems found. Problems are classified as _errors_ or _warnings_. By default _errors_ will not create new files, however this can be changed using the `--force` option.

### Boxouts

Various boxed-out sections are available for use:

- example
- supplement
- background
- definition
- weblink
- theorem
- proposition

Example syntax:

```
####[example]
My example
####[/example]
```

#### Task/answer boxout

There is special functionality for tasks and answers. Each task should have one answer, and each answer must be nested inside a task. A task can be marked as optional.

```
###[task, optional]
An optional task.
####[answer]
The answer
####[/answer]
###[/task]
```

In the resulting HTML, the answer is hidden and revealed by clicking "Show answer". In the PDF version, all answers are put at the end of the document.

### Columns

If you'd like to show 2 plots side-by-side for comparison, there is column syntax. In the HTML version this will collapse to single columns on smaller screens.

This syntax is backwards compatible with BOLDtools:

```
##[columns]
###[column, imgsrc="LMpr.svg"]
Samples from the prior distribution
###[/column]
###[column, imgsrc="LMpo.svg"]
Samples from the posterior distribution
###[/column]
##[/columns]
```

If you no longer need to compile notes with BOLDtools, then you can use conventional Markdown image syntax:

```
##[columns]
###[column]
![Samples from the prior distribution](LMpr.svg)
###[/column]
###[column]
![Samples from the posterior distribution](LMpo.svg)
###[/column]
##[/columns]
```

Or knitr code blocks:

````
##[columns]
###[column]
```{r}
(my plot)
```
###[/column]
###[column]
```{r}
(my plot)
```
###[/column]
##[/columns]
````

### knitr Output devices

This project uses the knitr output device `svglite` by default. SVGs are ideal for HTML documents as they remain sharp at every size, and can be made interactive easily. However there are some occassions where SVGs are not suitable:

- If your plot has too many points
- If your plot contains raster-like visualisation such as heat maps or photos

In these cases it makes more sense to output a PNG image. You can achieve this by overriding the default `dev`:

````
```{r, dev='png'}
(my plot)
```
````

I have set a default of `fig.retina=2` which means the resulting plot is just over 1000px in width, which should be a sensible default for most screens.

### Language switcher

You can contain and switch between programming languages R and Python in step-by-step instructions using the
outer `language-switcher` and inner `r` and `python` [container directives](https://github.com/syntax-tree/mdast-util-directive#containerdirective), for example:

```
::::language-switcher
:::r
I am R
:::

:::python
I am Python
:::
::::
```

## Known Issues

I've tried to keep necessary changes to a minimum, but there are few things that may pop up depending on how you have written the coursework.

### Heading structure

There should be only one `<h1>` in a document, and it is defined in each week's .yaml file as `title`. Do not use `<h1>` headings in the .Rmd files (for example `# My heading`). Instead, please use `<h2>` to `<h6>` headings:

```
## Section title
###### Smallest title
```

There is a Table of Contents in the HTML files with links to all the `<h2>`'s and `<h3>`'s in the sidebar. Please have a look at how your titles are rendered here. It's recommended to keep titles as short and concise as possible for accessibility purposes.

### Whitespace

While checking the output of this tool you may notice whole paragraphs have gone missing. This is due to a difference in the parsing of Markdown whitespace in [Pandoc](https://github.com/jgm/pandoc) (used in BOLDtools) and [Remark](https://github.com/remarkjs/remark) (used here). Generally each bit of block content written in Markdown should be separated with an empty line, and Remark is unfortunately more strict about this than Pandoc. The fix should just be to add an empty line between sections.

You may also spot an error in the parsing of inline LaTeX due to whitespace - adding a space before and/or after the delimiters should fix it.

### LaTeX differences

The previous compiler, BOLDTools converted coursework as:

1. RMarkdown -> LaTeX with [Knitr](https://yihui.org/knitr)
2. LaTeX -> PDF (or HTML) with [Pandoc](https://pandoc.org)

In this compiler, the journey goes:

1. RMarkdown -> Markdown with [Knitr](https://yihui.org/knitr)
2. Markdown with embedded TeX -> HTML with embedded TeX with [Remark](https://remark.js.org)
3. HTML with embedded TeX -> HTML with accessible rendered SVG equations with [MathJax](https://www.mathjax.org)
4. HTML -> PDF with [Puppetteer](https://pptr.dev)

The real-world difference is at no point is the document entirely LaTeX using this compiler. Previously, LaTeX could be used in place of equivalent Markdown syntax, which although not idiomatic RMarkdown, worked anyway. Unfortunately now it probably wont work— TeX should only be used for math equations.

#### Inline references

Due to limitations of [MathJax](https://www.mathjax.org), the LaTeX rendering tool with accessibility features that is used in this project, you can only reference numbered sections using, for example `\begin{align}`.

#### `\textbf`

LaTeX syntax `\textbf` is currently converted to the equivalent Markdown (\*\*bold text\*\*). If you have used `\textbf` to highlight some characters in an equation please use an alternative such as `\boldsymbol`.

#### `\tabular`

LaTeX tabular is not currently supported by MathJax, and recreating all its features in HTML would be a complex project on its own. Instead, I recommend you use [Markdown table syntax](https://github.github.com/gfm/#table) to be most accessible. If you have a use case for a heavily formatted LaTeX table, you can always render it as a PDF and include the PDF as an image, however please be aware that the data in this table not be readable by assistive tools.

#### You can't use 'macro parameter character #' in math mode

This is due to `$` symbols being used to delimit LaTeX. If you would like to use a `$` symbol for another purpose please escape it with a preceeding backslash: `\$`.

#### Wiki

If you come across other TeX/LaTeX which needs to be converted to a Markdown equivalent, you can help other coursework authors by documenting it on the [TeX to Markdown conversion chart](https://github.com/UofGAnalytics/build-coursework/wiki/TeX-to-Markdown-conversion-chart).

## Bug reporting

If you find an issue with the output of this tool, please send an email to david.mcarthur.2@glasgow.ac.uk with the misbehaving Markdown and a description of what you expected to see.
