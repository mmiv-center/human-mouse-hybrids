<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="/docs/4.0/assets/img/favicons/favicon.ico">

    <title>Mouse-Human Hybrids</title>

<!--    <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/cover/"> -->

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/colorbrewer.css" rel="stylesheet">
    <link href="css/cover_bright.css" rel="stylesheet">
  </head>

  <body class="text-center">

    <div class="cover-container d-flex h-100 p-10 mx-auto flex-column">
      <header class="masthead">
        <div class="inner">
          <h3 class="masthead-brand">Mouse-Human Hybrids</h3>
          <nav class="nav nav-masthead justify-content-center">
            <!-- <a class="nav-link active" href="#">Home</a>
            <a class="nav-link" href="#">Features</a>
            <a class="nav-link" href="#">Contact</a> -->
          </nav>
        </div>
      </header>

      <main role="main" class="inner cover">
        <!-- <h1 class="cover-heading">Mouse-Human Hybrids</h1> -->
        <!-- <p class="lead">A square and a list of bar plots.</p> -->
      </main>

      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <div id="control"></div>
          </div>
          <div class="col-md-9">
            <div style="align-items: center; height: 100%; font-size: 24px; background-color: #FFF; margin-bottom: 5px; text-align: left;">
              <div id="control-explanation">Highlight Mouse-Human hybrids by selecting a circle section</div>
              <div id="control-explanation-detail"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div id="my_dataviz"></div>
        </div>
      </div>

<!--      <footer class="mastfoot mt-auto">
        <div class="inner">
          <p>Trivial data presentations.</p>
        </div>
      </footer> -->
    </div>

    <div id="tooltip" style="display: none; position: absolute; width: 250px; min-height: 60px; border: 1px solid gray; border-radius: 2px; background-color: white; fill: gray;">
      <div id="tooltip-content" style="overflow-y: scroll; padding-left: 5px; z-index: 1; height: 100%; padding-right: 5px; position: relative;">
        <div id="tooltip-title"></div>
        <div style="position: absolute; right: 5px; top: 2px; z-index: 0; font-size: 10px; vertical-align: middle; height: 15px; width: 50px; background-color: orange; border-radius: 2px; color: white;">
        count&nbsp; 
          <span id="tooltip-height"></span>
        </div>
        <div class="tooltip-line">  
          <div id="tooltip-modification"></div>
        </div>
        <div class="tooltip-line"><p>
          <span id="tooltip-dominant"></span>
          <span id="tooltip-neighbors"></span></p>
        </div>
        <div class="tooltip-line">
        </div>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery-3.6.0.min.js"></script>
    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/d3.v6.js"></script>
    <script src="js/d3.geom.js"></script>
    <script src="js/d3-weighted-voronoi.js"></script>
    <script src="js/jsfft.js"></script>
    <script src="js/all.js"></script>
  </body>
</html>

