module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build',
        mac_icns: './app/icon.icns',
        mac: true,
        win: false,
        linux32: false,
        linux64: false,
      },
      src: './app/**/*'
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};
