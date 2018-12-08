const gulp          = require("gulp"),
      del           = require("del"),
      colors        = require("colors"),
      runSequence   = require("run-sequence");

gulp.task("clean", function () {
    try {
        del.sync(["backend/public/**", "!backend/public"]);
        console.log(`Backend public folder ${colors.underline.red("deleted")} successfully!`);
    } catch (e) {
        console.error(e)
    }
    return;
});


gulp.task("build", function () {
    return gulp.src([
        "frontend/dist/**/*"
    ])
        .pipe(gulp.dest("backend/public/"));
});

gulp.task("watch", function (cb) {

    runSequence("clean", "build", cb);

    var watcher = gulp.watch("frontend/dist/**/*", ["build"]);
    watcher.on("change", function (event) {
        console.log("File " + event.path + " was " + colors.underline.green(`${event.type}`));
    });
});


gulp.task("default", ["watch"]);