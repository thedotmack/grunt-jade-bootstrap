# Grunt / Jade / Bootstrap

## Installation

Type `npm install` to install.

## Usage

1. Set up all of your JS files to concatenate in `gruntfile.js`
2. `@import` any additional CSS / Less into main.less
3. Include any additional assets with a new `copy` task in the gruntfile
4. Type `grunt server` to begin the server / watch process.

To build without watching, type `grunt build`

## Notes

1. Assets in jade files are relative to the `build` folder. ex. `img(src="assets/images/my_image_file.jpg")`