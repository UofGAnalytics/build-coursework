This tool converts ODL courses written as .Rmd and .yaml files, to accessible HTML and PDF documents.

## Installation

### Install NVM

The easiest way to install Node.js is to first install a command line tool called Node Version Manager. Follow installation instructions on the [nvm-sh/nvm](https://github.com/nvm-sh/nvm#installing-and-updating) project for Mac and Linux and [coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows#install-nvm-windows) on Windows.

Next, you need to run a few terminal commands. If you are unfamiliar with this, here is a quick tutorial for [Mac](https://www.howtogeek.com/682770/how-to-open-the-terminal-on-a-mac) and [Windows](https://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10#opencommandpromptfromsearch) (Run as administrator).

### Install Node.js

Run the following commands to install the [latest LTS version of Node.js](https://nodejs.org), currently 14.17.5:

```bash
nvm install 14
nvm use 14
```

To check everything installed correctly, run the following:

```bash
node –v
# v14.17.5 or similar
```

Node Package Manager should automatically be installed:

```bash
npm –v
# 7.18.1 or similar
```

### Ensure Git is installed

```bash
git --version
```

If not, please follow the instructions here: https://docs.github.com/en/get-started/quickstart/set-up-git.

### Install the tool from Github via Node Package Manager

Use one of the commands below should install the project, depending on your Github security preferences:

```bash
# using SSH
npm install -g UofGAnalytics/build-coursework
```

Ensure it worked correctly:

```bash
npm list –g --depth=0
> ...
> build-coursework@... -> ...github:UofGAnalytics/build-coursework...
> ...
```

## Usage

Via the terminal, navigate to a coursework folder with a `course.yaml` file, for example:

```bash
cd /Users/staff/my-course
```

Run the program:

```bash
# compile the whole course (may take a while)
rmarkdown

# compile just week 1
rmarkdown --week=1

# compile just HTML version for week 1
rmarkdown --noPdf --week=1
```

Once complete, you will find a `build` folder in beside the `course.yaml` file, with the .html and/or .pdf files inside. You can open the .html files with a browser such as Chrome or Firefox.

> Each time you re-run the command (press the up arrow and enter to quickly re-run your previous command in the terminal) the previous file(s) will be overwritten, and you can refresh your browser window to see the changes.

> If you are used to using RStudio, you can use the Terminal tab there to run the `rmarkdown` command if you prefer.

### Update

One day you may run the command and see a message such as:

```
> You are running version 1.0.0 and the latest version is 1.5.0.
> Run the following command to update:
> npm install -g UofGAnalytics/build-coursework@v1.5.0
```

To update just run the command that is suggested.

### Options

| Argument | Type      | Description                                                                   |
| :------- | :-------- | :---------------------------------------------------------------------------- |
| week     | _number_  | Build specific week (1-based index)                                           |
| noHtml   | _boolean_ | Don't compile to HTML                                                         |
| noPdf    | _boolean_ | Don't compile to PDF                                                          |
| spelling | _boolean_ | Run spell checker (opt-in as so many false negatives but can still be useful) |
| force    | _boolean_ | Compile even with fatal errors (can be useful for debugging)                  |

### Reporting

I perform various static analysis on the coursework and report any problems found. Problems are classified as _errors_ or _warnings_. By default _errors_ will not create new files, however this can be changed using the `--force` option.

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

While checking the output of this too you may notice whole paragraphs have gone missing. This is due to a difference in the parsing of Markdown whitespace in [Pandoc](https://github.com/jgm/pandoc) (used in BOLDtools) and [Remark](https://github.com/remarkjs/remark) (used here). Generally each bit of content written in Markdown should be separated with an empty line, and Remark is a little more strict about this. The fix should be to add an empty line between sections.

You may also spot an error in the parsing of inline LaTeX due to whitespace - adding a space before and/or after the delimiters should fix it.

### Transparent images

Due to having different background colour options for accessibility, a transparent image that looks legible against a light background will probably not be legible on a dark background. Transparent images should be avoided and a solid white background preferred.

### Inline LaTeX references

Due to differences in how Pandoc and [MathJax](https://www.mathjax.org) extract LaTeX, you can only reference numbered sections using, for example `\begin{align}`.

### LaTeX \textbf

LaTeX syntax `\textbf` is currently converted to the equivalent Markdown (\*\*bold text\*\*). If you have used `\textbf` to highlight some characters in an equation please use `\boldsymbol` instead.

## Bug reporting

If you find an issue with the output of this tool, please send an email to david.mcarthur.2@glasgow.ac.uk with the misbehaving Markdown and a description of what you expected to see.
