open! Core
open! Bonsai_web

let root_component = Bonsai.const (Vdom.Node.text "Hello Bonsai!!")
let () = 
ignore(Bonsai_web.Start.start Bonsai_web.Start.Result_spec.just_the_view ~bind_to_element_with_id:"app" root_component)