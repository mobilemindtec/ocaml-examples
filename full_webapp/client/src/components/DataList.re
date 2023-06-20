[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

let fetchData = (setDataList) => {
	let _ = Js.Promise.(
		fetch("/api/data")
			|> then_(res => res##json())
			|> then_(dataJson => {
				Js.Console.error(dataJson);
				setDataList(_ => dataJson);
				resolve();
			})
			|> catch(err => {
				Js.Console.error(err);
				resolve();
			})
			|> ignore
	);	
	();
};

[@react.component]
let make = () => {

	let (dataList, setDataList) = React.useState(() => [||]);
	<div>
		<h3>
			{React.string("Data Go Here!")}
		</h3>
		<div>
			<button onClick={_ => fetchData(setDataList)}>
				{React.string("Fetch")}
			</button>
		</div>
		<div>
			<ul>
			{
				dataList
					|> Array.mapi((i, dataItem) =>
						<li key={string_of_int(i)}>{React.string(dataItem)}</li>)
					|> React.array
			}
			</ul>	
		</div>
	</div>		
}