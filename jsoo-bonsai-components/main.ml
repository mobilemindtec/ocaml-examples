open! Core
open! Bonsai_web
open! Async_kernel
open Bonsai.Let_syntax

module Form = Bonsai_web_ui_form

let li_lst = 
  let open Vdom.Node in
    List.init 10 ~f: (fun x -> li [ text("Item " ^ string_of_int(x)) ])
;;

let bulleted_list: Vdom.Node.t = 
  let open Vdom.Node in
    div
      [ h3 [ text "my list" ]
      ; ul li_lst]
;;

let mylabel : Vdom.Node.t = Vdom.Node.text "Hello Bonsai!!"

let myinput: Vdom.Node.t =
  let open Vdom.Node in 
    input
      ~attr:(Vdom.Attr.placeholder "TODO..") 
      []
;;

let css_gen: Vdom.Node.t =
  let open Vdom.Node in
    span ~attr:(Vdom.Attr.style (Css_gen.color (`Name "red")))
    [ text "this is red span text"]
;;

let alert s = Js_of_ocaml.Dom_html.window##alert (Js_of_ocaml.Js.string s)

let btn_click: Vdom.Node.t =
  let open Vdom.Node in
    button 
      ~attr: 
        (Vdom.Attr.on_click (fun _ -> 
          alert "hello there!"; 
          Ui_effect.Ignore))
      [ Vdom.Node.text "click me!" ]
;;

(* 

  https://bonsai.red/02-dynamism.html

  The two phrases a = a and b = b may look a little silly, 
  but they are necessary. The expression on the right-hand side of both bindings 
  in the let%arr has type int Value.t, but the pattern on the left hand side is a 
  plain old int that we can freely pass to Int.to_string. So let%arr is useful for 
  “unwrapping” the data inside a Value.t so that we can access it for a limited scope.

  The type of the entire let%arr expression, which includes the stuff on both sides of in, 
  is string Computation.t rather than string Value.t. This means that the result is a graph 
  and not a node in a graph. To obtain the final node of a Computation.t graph, we can 
  use a let%sub expression.

  The type of the entire let%arr expression, which includes the stuff on both sides of in, 
  is string Computation.t rather than string Value.t. 
  This means that the result is a graph and not a node in a graph. 
  To obtain the final node of a Computation.t graph, we can use a let%sub expression.  

  We provide a computation and let%sub provides a name we can use to refer to the result 
  node of that computation. In the first let%sub above, the computation is 
  juxtapose_digits a b and the name is juxtaposed. 
  The important thing about using let%sub is that juxtaposed has type string Value.t, 
  so we can freely use it in let%arr expressions.  
*)
let justapose_digits ~(delimiter: string) (a: int Value.t) (b: int Value.t) : string Computation.t =
  let%arr a = a
  and b = b in
  Int.to_string a ^ delimiter ^ Int.to_string b
 
let _justapose_and_sum (a: int Value.t) (b: int Value.t) : string Computation.t =
  let%sub justaposed = justapose_digits ~delimiter:" _ " a b in
  let%sub sum =
    (* let%arr unwrapping the data inside a Value.t *)
    let%arr a = a
    and b = b in
    Int.to_string (a + b)
  in
  let%arr justaposed = justaposed
  and sum = sum in
  justaposed ^ " = " ^ sum


let counter_button =
  let%sub count, set_count = Bonsai.state [%here] (module Int) ~default_model:0 in
  let%arr count = count
  and set_count = set_count in
  let open Vdom.Node in    
    div
      [ text [%string "Counter value: %{count#Int}" ]
      ; button
          ~attr: (Vdom.Attr.many [ Vdom.Attr.on_click (fun _ ->  set_count (count + 1))
                                ; Vdom.Attr.style (Css_gen.margin_left (`Px_float 10.0)) ])
                 
          [ text "increment count" ]
      ]
;;

let counter_every_second: int Value.t = 
  let counter_var : int Bonsai.Var.t = Bonsai.Var.create (-1) in
  every (Time_ns.Span.of_sec 1.0) (fun () -> 
    Bonsai.Var.update counter_var ~f:(fun i -> i + 1));
  Bonsai.Var.value counter_var
;;

let view_counter: Vdom.Node.t Computation.t =
  let%arr couter = counter_every_second in
  Vdom.Node.textf "counter: %d" couter
;;

let textbox: (string * Vdom.Node.t) Computation.t =
  let%sub state, set_state = Bonsai.state [%here] (module String) ~default_model:"" in
  let%arr state = state
  and set_state = set_state in 
  let view = 
    Vdom.Node.input
      ~attr:Vdom.Attr.(value_prop state @ on_input (fun _ new_text -> set_state new_text))       
      []
  in
  state, view
;;

let two_textboxes: Vdom.Node.t Computation.t = 
  let%sub textbox_a = textbox in
  let%sub textbox_b = textbox in
  let%arr contents_a, view_a = textbox_a
  and contents_b, view_b = textbox_b in
  let display = Vdom.Node.textf "a: %s, b: %s" contents_a contents_b in
  Vdom.Node.div
    ~attr:(Vdom.Attr.style (Css_gen.display `Inline_grid))
    [ view_a; view_b; display ]
;;

let state_based_counter : Vdom.Node.t Computation.t =
  let%sub state, set_state = Bonsai.state [%here] (module Int) ~default_model:0 in
  let%arr state = state
  and set_state = set_state in
  let decrement =
    Vdom.Node.button
      ~attr:(Vdom.Attr.on_click (fun _ -> set_state (state - 1)))
      [ Vdom.Node.text "-1" ]
  in
  let increment = 
    Vdom.Node.button
      ~attr:(Vdom.Attr.on_click (fun _ -> set_state (state + 1)))
      [ Vdom.Node.text "+1"]
  in
  Vdom.Node.div [decrement; Vdom.Node.textf "%d" state; increment]
;;

module Action = struct
  type t = 
    | Increment
    | Decrement
    [@@deriving sexp_of]
end

let counter_state_machine: Vdom.Node.t Computation.t = 
  let%sub state, inject =
    Bonsai.state_machine0
      [%here]
      (module Int)
      (module Action)
      ~default_model:0
      ~apply_action:(fun ~inject:_ ~schedule_event:_ model action ->
        match action with
        | Increment -> model + 1
        | Decrement -> model -1)
      in
      let%arr state = state
      and inject = inject in
      let decrement = 
        Vdom.Node.button
          ~attr:(Vdom.Attr.on_click (fun _ -> inject Decrement))
          [Vdom.Node.text "-1"]
      in
      let increment = 
        Vdom.Node.button
          ~attr:(Vdom.Attr.on_click (fun _ -> inject Increment))
          [Vdom.Node.text "+1"]
      in
      Vdom.Node.div
        [decrement; Vdom.Node.textf "%d" state; increment]
;;

let form_textbox =
  let%sub textbox = Form.Elements.Textbox.string [%here] in
  let%arr textbox = textbox >>| Form.label "my textbox" in 
  let value = Form.value textbox in
  Vdom.Node.div
    [ Form.view_as_vdom textbox
    ; Vdom.Node.sexp_for_debugging ([%sexp_of: string Or_error.t] value)]
;;

let formbox_on_submit =
  let%sub textbox = Form.Elements.Textbox.string [%here] in
  let%arr textbox = textbox in
  textbox
  |> Form.label "text to alert"
  |> Form.view_as_vdom 
      ~on_submit:(Form.Submit.create ~f:(fun s -> alert s; Ui_effect.Ignore) ())
;;

type f_t =
  { some_string : string
  ; an_int : int
  ; on_or_off : bool
  }
[@@deriving typed_fields, sexp_of]

let form_of_t : f_t Form.t Computation.t =
  Form.Typed.Record.make
  (module struct
    module Typed_field = Typed_field_of_f_t
    let label_for_field = `Inferred
    let form_for_field : type a. a Typed_field.t -> a Form.t Computation.t = function
    | Some_string -> Form.Elements.Textbox.string [%here]
    | An_int -> Form.Elements.Number.int [%here] ~default:0 ~step:1 ()
    | On_or_off -> Form.Elements.Checkbox.bool  [%here] ~default:false
  ;; 
  end)
;;
(*
let root_component = Bonsai.const (Vdom.Node.text "Hello Bonsai!!")   
*)
let root_component = 
  let open Vdom.Node in
  let b = br () in
  let%sub counter_button1 = counter_button in
  let%sub counter_button2 = counter_button in
  let%sub counter_button3 = counter_button in
  let%sub view_counter = view_counter in
  let%sub two_textboxes = two_textboxes in 
  let%sub state_based_counter = state_based_counter in
  let%sub counter_state_machine = counter_state_machine in
  let%sub form_textbox = form_textbox in
  let%sub formbox_on_submit = formbox_on_submit in 
  let%arr counter_button1 = counter_button1
  and counter_button2 = counter_button2
  and counter_button3 = counter_button3 
  and view_counter = view_counter 
  and two_textboxes = two_textboxes
  and state_based_counter = state_based_counter 
  and counter_state_machine = counter_state_machine
  and form_textbox = form_textbox
  and formbox_on_submit = formbox_on_submit
  in
    Vdom.Node.div  [
      mylabel; 
      bulleted_list; 
      myinput; 
      b; css_gen; 
      b; btn_click; 
      b; counter_button1; 
      b; counter_button2; 
      b; counter_button3; 
      b; view_counter;
      b; two_textboxes;
      b; state_based_counter;
      b; counter_state_machine;
      b; form_textbox;
      b; formbox_on_submit]
;;


let () = 
  ignore(Bonsai_web.Start.start Bonsai_web.Start.Result_spec.just_the_view ~bind_to_element_with_id:"app" root_component)