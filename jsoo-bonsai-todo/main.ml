open! Core
open! Bonsai_web
open! Async_kernel
open Bonsai.Let_syntax

module Todo = struct
    
  type todo = 
    { id: int
    ; title: string
    ; completed: bool
    }
  [@@deriving sexp, equal]
  
  type t = todo Int.Map.t [@@deriving sexp, equal]

  let _empty: todo Int.Map.t = Int.Map.empty

  let mock: todo Int.Map.t =
    let lst = List.init 5 ~f:(fun i -> i, {id=i; title="task " ^ (Int.to_string i); completed=false}) in 
    let map = Map.of_alist_exn (module Int) lst in
    map
  ;;
  
end

module Action = struct
  type t =
    | New_todo of string
    | Delete_todo of int
    | Complete_todo of int
    | Uncomplete_todo of int
    | Toogle_todo of int
    | Clear_completed
    | Toggle_all of { active_todos_ids: Int.Set.t }
  [@@deriving sexp]
end


let todos = Bonsai.Var.create Todo.mock

let get_next_id todos =  
  Map.max_elt todos |> Option.value_map ~f:(fun (id, _) -> id + 1) ~default:1
;;

let _alert s = Js_of_ocaml.Dom_html.window##alert (Js_of_ocaml.Js.string s)

let todo_item_dispatch_action (action: Action.t) =   
  let curr_todos = Bonsai.Var.get todos in
  let new_todos = match action with
  | New_todo title -> 
    let id = get_next_id curr_todos in  
    Int.Map.set curr_todos ~key:id ~data: {id; title=title; completed=false}   
  | Toogle_todo id ->
    Map.change curr_todos id ~f:(function
    | None -> None
    | Some todo -> Some {todo with completed = not todo.completed})  
  | _ -> curr_todos
  in
  Bonsai.Var.set todos new_todos; ()    
;;

let title: Vdom.Node.t =
  Vdom.Node.div     
    [ Vdom.Node.h1 [Vdom.Node.text "todos"] ]
;;

let todo_input: Vdom.Node.t Computation.t =
  let%sub state, set_state = Bonsai.state [%here] (module String) ~default_model:"" in
  let%arr state = state
  and set_state = set_state in
  let open Vdom.Attr in
  let open Vdom.Node in
  let enter_handler evt = 
    match Js_of_ocaml.Dom_html.Keyboard_code.of_event evt with
    | Enter -> 
        todo_item_dispatch_action @@ Action.New_todo state; set_state ""
    | _ -> Ui_effect.Ignore
  in
  let view =
    div 
    [ input       
      ~attr: (many [
        value_prop state 
      ; on_keydown enter_handler
      ; on_input (fun _ new_text -> set_state new_text)
      ; placeholder "What needs to be done?" 
      ; class_ "todo-new"
      ])
      [ textf "%s" state ]
    ]
  in
  view
;;

let todo_item_ckeckbox completed ~on_check  = 
  let open Vdom.Node in
  let checkbox_state = match completed with
  | true -> Vdom.Attr.checked
  | _ -> Vdom.Attr.empty
  in
  label 
    ~attr:Vdom.Attr.(class_ "checkmark-container" @ checkbox_state)
    [
      input ~attr:Vdom.Attr.(type_ "checkbox" @ on_change (fun _ _ -> (on_check ()); Ui_effect.Ignore)) []
    ; span ~attr:(Vdom.Attr.class_ "checkmark") []
    ]  
;;

let checkbox_style_cls completed = match completed with
  | true -> ["todo-item"; "completed"]
  | _ -> ["todo-item"]
;;

let new_todo_item_t_view (todo: Todo.todo Value.t)=   
  let open Vdom.Node in 
  let%arr todo = todo in
  div
    ~attr:(Vdom.Attr.classes @@ checkbox_style_cls todo.completed)
    [
      todo_item_ckeckbox todo.completed ~on_check:(fun _ -> todo_item_dispatch_action @@ Action.Toogle_todo todo.id )
      ; span ~attr:(Vdom.Attr.class_ "title") [ textf "%s" todo.title ]
    ]  
;;

let new_todo_item_view (todo: Todo.todo)=   
  let open Vdom.Node in 
  div
    ~attr:(Vdom.Attr.classes @@ checkbox_style_cls todo.completed)
    [
      todo_item_ckeckbox todo.completed ~on_check:(fun _ -> todo_item_dispatch_action @@ Action.Toogle_todo todo.id )
      ; span ~attr:(Vdom.Attr.class_ "title") [ textf "%s" todo.title ]
    ]  
;;

let _todo_items: Vdom.Node.t Computation.t =  
  let todos = Bonsai.Var.value todos in
  let%arr todos = todos in
  let rows = List.map (Map.data todos) ~f:(fun v -> new_todo_item_view v) in    
  Vdom.Node.div rows
;;

let todo_items: Vdom.Node.t Computation.t =  
  let%sub rows = 
    Bonsai.assoc
      (module Int)
      (Bonsai.Var.value todos)
      ~f:(fun _ todo -> new_todo_item_t_view todo)
  in  
  let%arr rows = rows in
  let () = print_endline "render todo_items" in
  Vdom.Node.div (Map.data rows)
;;

let root_component = 
  let%sub todo_input = todo_input in
  let%sub todo_items = todo_items in 
  let%arr todo_input = todo_input 
  and todo_items = todo_items
  in    
  Vdom.Node.div 
    ~attr:(Vdom.Attr.class_ "todos")
    [ title; todo_input; todo_items ]
;;

let () = 
  ignore(Bonsai_web.Start.start Bonsai_web.Start.Result_spec.just_the_view ~bind_to_element_with_id:"app" root_component)
