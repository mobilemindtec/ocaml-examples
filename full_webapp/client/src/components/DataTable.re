
[@react.component]
let make = () => {	
	let data = Array.init(3000, _ => Random.int(3000));	
	let (dataTable, setDataTable) = React.useState(() => data);

	<div>
		<h3>
			{React.string("Data Go Here!")}
		</h3>
		<div>

			<table>
				<tbody>
					{
						dataTable
							|> Array.mapi((i, dataItem) =>
								<tr key={string_of_int(i)}>
									<td>{React.int(i)}</td>
									<td>{React.int(dataItem)}</td>
								</tr>)
							|> React.array
					}
				</tbody>
			</table>

		</div>
	</div>		
}