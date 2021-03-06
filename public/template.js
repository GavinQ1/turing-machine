export default function(preloadedState) {
	return `
	<!doctype html>
	<html lang="en">
	  <head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <title>Turing Machine Simulator</title>
	    <link rel="shortcut icon" href="http://www.vassar.edu/favicon.ico" />
	    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
	    <link rel="stylesheet" href="./container.css">
	    <link rel="stylesheet" href="./tape.css">
	    <link rel="stylesheet" href="./table.css">
	    <script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
	    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
	  </head>
      <body>
        <div id="container"></div>
        
      </body>
      <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
      </script>
      <script src="/static/bundle.js"></script>
    </html>
    `
}