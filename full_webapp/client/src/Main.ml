
let _ =
	let props = DataTable.makeProps () in 
	ReactDOMRe.renderToElementWithId
		(React.createElement DataTable.make props)
		"app"

(*Js.log("Hello, ReScript") *)