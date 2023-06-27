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
    let lst = List.init 2 ~f:(fun i -> i, {id=i; title="task " ^ (Int.to_string i); completed=false}) in 
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

module Filter = struct
  type t =
    | All
    | Completed
    | Uncompleted
  [@@deriving sexp]  

  let compare (x: t) (y: t) = 
    match x,y with 
    | All, All -> true
    | Completed, Completed -> true
    | Uncompleted, Uncompleted -> true
    | _ -> false
  ;;

  let get_label (action:t) =
    match action with
    | All -> "All"
    | Completed -> "Complete"
    | Uncompleted -> "Active"
  ;;
 
end  

let todos = Bonsai.Var.create Todo.mock
let filter = Bonsai.Var.create Filter.All

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
  | Action.Delete_todo id -> 
    Map.remove curr_todos id
  | Action.Clear_completed ->
    Map.filter curr_todos ~f:(fun data -> not data.completed)
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
      ~attr: (many [ value_prop state 
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
  let checkbox_state, input_class = match completed with
  | true -> Vdom.Attr.checked, Vdom.Attr.class_ "checked"
  | _ -> Vdom.Attr.empty, Vdom.Attr.empty
  in
  label 
    ~attr:Vdom.Attr.(class_ "checkmark-container"  @ checkbox_state)
    [
      input ~attr:Vdom.Attr.(type_ "checkbox" @ input_class @ on_change (fun _ _ -> (on_check ()); Ui_effect.Ignore)) []
    ; span ~attr:(Vdom.Attr.class_ "checkmark") []
    ]  
;;

let checkbox_class completed = 
  match completed with
  | true -> ["todo-item"; "completed"]
  | _ -> ["todo-item"]
;;

let new_todo_item_view (todo: Todo.todo Value.t)=   
  let open Vdom.Node in 
  let%arr todo = todo in
  div
    ~attr:(Vdom.Attr.classes @@ checkbox_class todo.completed)
    [
      todo_item_ckeckbox 
        todo.completed 
        ~on_check:(fun _ -> todo_item_dispatch_action @@ Action.Toogle_todo todo.id )
      ; span ~attr:(Vdom.Attr.class_ "title") [ textf "%s" todo.title ]
      ; button 
          ~attr: (Vdom.Attr.many [ Vdom.Attr.class_ "btn-remove"
                                 ; Vdom.Attr.on_click (fun _ -> todo_item_dispatch_action @@ Action.Delete_todo todo.id; Ui_effect.Ignore ) ])
          []
    ]  
;;

(* deprecated *)
let _new_todo_item_view (todo: Todo.todo)=   
  let open Vdom.Node in 
  div
    ~attr:(Vdom.Attr.classes @@ checkbox_class todo.completed)
    [
      todo_item_ckeckbox todo.completed ~on_check:(fun _ -> todo_item_dispatch_action @@ Action.Toogle_todo todo.id )
      ; span ~attr:(Vdom.Attr.class_ "title") [ textf "%s" todo.title ]
    ]  
;;

(* deprecated *)
let _todo_items: Vdom.Node.t Computation.t =  
  let todos = Bonsai.Var.value todos in
  let%arr todos = todos in
  let rows = List.map (Map.data todos) ~f:(fun v -> _new_todo_item_view v) in    
  Vdom.Node.div 
    ~attr:(Vdom.Attr.class_ "todo-items") 
    rows
;;

let filtered_model: Todo.t Value.t =
  let todos = Bonsai.Var.value todos in
  let filter = Bonsai.Var.value filter in
  let%map todos = todos 
  and filter = filter 
  in
  match filter with 
  | All -> todos
  | Completed -> Map.filter todos ~f:(fun it -> it.completed)
  | Uncompleted ->  Map.filter todos ~f:(fun it -> not it.completed)
;;

let todo_items: Vdom.Node.t Computation.t =  
  let%sub rows = 
    Bonsai.assoc
      (module Int)
      filtered_model
      ~f:(fun _ todo -> new_todo_item_view todo)
  in  
  let%arr rows = rows in
  Vdom.Node.div 
    ~attr:(Vdom.Attr.class_ "todo-items")
    (Map.data rows)
;;

let footer_action_link action label classes_  =
  Vdom.Node.button 
    ~attr:Vdom.Attr.(classes classes_ @ on_click (fun _ -> Bonsai.Var.set filter action; Vdom.Effect.Ignore))
    [ Vdom.Node.span [Vdom.Node.textf "%s" label]]
;;  

let footer_action (action: Filter.t): Vdom.Node.t Computation.t =
  let filter = Bonsai.Var.value filter in
  let%arr filter = filter in
  let classes = 
    if (Filter.compare action  filter) then ["todo-action"; "active"] 
    else ["todo-action"] 
  in
  let label = Filter.get_label action in
  footer_action_link action label classes
;;

let clear_completed (model: Todo.t) =
  let count = Map.count model ~f:(fun it -> it.completed) in  
  let clean_action = 
    if count = 0 then Vdom.Node.None
    else
      Vdom.Node.a 
        ~attr: (Vdom.Attr.on_click (fun _ -> todo_item_dispatch_action @@ Action.Clear_completed; Ui_effect.Ignore))
        [Vdom.Node.textf "Clear completed"]
    in  
  Vdom.Node.div 
    ~attr:(Vdom.Attr.class_ "todo-clean") [clean_action]
        
let todo_footer: Vdom.Node.t Computation.t =
  let todos = Bonsai.Var.value todos in      
  let%sub action_all = footer_action Filter.All in
  let%sub action_uncompleted = footer_action Filter.Uncompleted in
  let%sub action_completed = footer_action Filter.Completed in
  let%arr action_all = action_all
  and action_uncompleted = action_uncompleted
  and action_completed = action_completed
  and todos = todos
  in
  let uncompleted_count = Map.count todos ~f:(fun it -> not it.completed) in  
  if (Map.is_empty todos) then
    Vdom.Node.None
  else
    let actions = [action_all; action_uncompleted; action_completed] in
    Vdom.Node.div
      ~attr:(Vdom.Attr.class_ "todo-footer")
      [
        Vdom.Node.div 
          ~attr:(Vdom.Attr.class_ "todo-count") 
          [Vdom.Node.textf "%d items" uncompleted_count]
      ; Vdom.Node.div 
          ~attr:(Vdom.Attr.class_ "todo-actions")
          actions
      ; clear_completed todos       
      ]    
    
;;

(* root component join all components of view *)
let root_component = 
  let%sub todo_input = todo_input in
  let%sub todo_items = todo_items in 
  let%sub todo_footer = todo_footer in
  let%arr todo_input = todo_input 
  and todo_items = todo_items
  and todo_footer = todo_footer
  in    
  Vdom.Node.div 
    ~attr:(Vdom.Attr.class_ "todos")
    [ title
    ; Vdom.Node.div ~attr:(Vdom.Attr.class_ "todos-inner")
        [ todo_input; todo_items;]
    ; todo_footer
    ]
;;

let () = 
  let open Bonsai_web.Start in  
    start Result_spec.just_the_view ~bind_to_element_with_id:"app" root_component |> ignore
