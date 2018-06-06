
# Extended Markdown

## Usage

After installation, usage is:

1. write a markdown file in the same directory with extension `.md`
1. run `make`

`emd.sh` will parse the file to create an html page
with fancy spoiler text that can be expanded like on
the [Endless blog.](https://endless.ersoft.org)

## Demo

Here's a demo. (Why?)(why-demo)

(start why-demo)

I like to show you what the point of it all is:
\\(a^2 + b^2 = c^2\\)

And some more math:
\\[
ax^2 + bx + c = 0
\\]

After which you use the (quadratic formula!Quadratic Formula)(quad-form).

(start quad-form)

\\[
x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
\\]

(stop quad-form)

(stop why-demo)

## Updates

`update-emd.sh` is a helper script to be run from a newly updated directory that:

* searches its first input recursively for any emd.sh files,

* updates the files in those directories with the files in the curent directory,

* touches any `.md` files in those directories and runs `emd.sh` on them.

`update-emd.sh` is designed to allow the user to have a reference git directory
for `emd.sh` that is updated by a single `git pull`,
painlessly pushing those updates to all other locations.

## Installation

Copying all files in this directory to another is all that is required
for installation.

If desired, `update-emd.sh` may be abused for installation.
Simply run `touch $DIR/emd.sh` for every directory `$DIR` that you want
to install `emd.sh` into, then run `update-emd.sh $SUPER_DIR` for any
directory `$SUPER_DIR` that contains all the install directories.

## Internal Dependencies

The makefile is set to run `emd.sh` on every `.md` file
in the current directory.
`emd.sh` depends on `premd.html` and `postmd.html`,
which it simply prepends and appends to every document after parsing markdown.

`extended_markdown.js` and `extended_markdown.css` are necessary
for the spoiler text to be handled correctly.

If you want an example of the CSS that formats everything just like
the [Endless blog](https://endless.ersoft.org/),
then you download [the CSS file for the Casper theme for Ghost](https://github.com/TryGhost/Casper/blob/master/assets/css/screen.css).

