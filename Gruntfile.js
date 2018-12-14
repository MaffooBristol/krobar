module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
      options: {
        build_dir: './build',
        mac_icns: './app/icon.png',
        mac: true,
        win: false,
        linux32: false,
        linux64: false,
				platforms: ['osx64'],
      },
      src: './app/**/*'
    },
  });

  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);
};
