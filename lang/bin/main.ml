
(* concat two strings *)
let concat x y =
  print_endline(x ^ ", " ^ y)

let print_name name =
  print_endline({|hello, |} ^ name)

let rec sort lst =
  match lst with
  | [] -> []
  | head :: tail -> insert head (sort tail)
and insert elt lst =
  match lst with
  | [] -> [elt]
  | head :: tail -> 
    if elt <= head then 
      elt :: lst 
    else 
      head :: insert elt tail
;;

let rec print_list lst = match lst with
  | [] -> print_endline "list done"
  | h :: t -> print_endline h; print_list t;;


let rec print_list_int lst = match lst with
  | [] -> print_endline "list done"
  | h :: t -> print_endline (string_of_int h); print_list_int t;;

type ratio = {num: int; denom: int};;

type mutable_point = { mutable x: float; mutable y: float}

let new_ratio num denom = {num; denom}

(*get one field*)
let get_num {num=num; _} = num

let int_part r = match r with
    {num=num; denom=denom} -> num / denom;;

let add_ratio r1 r2 =
  {num = r1.num * r2.num; denom = r1.denom * r2.denom}

(* update one field *)
let int_product integer ratio = {ratio with num = integer * ratio.num}

let print_int i = print_endline ("int = " ^(string_of_int i))

let print_float i = print_endline ("float = " ^(string_of_float i))


let translate p dx dy =
  p.x <- p.x +. dx; p.y <- p.y +. dy

type number = Int of int | Float of float | Error;;

type sign = Positive | Negative;;

let print_num n = match n with
  | Float f -> print_float f
  | Int i -> print_int i
  | Error -> print_endline "number error"


let sign_int n = if n >= 0 then Positive else Negative

let add_num n1 n2 =
  match (n1, n2) with
  | (Int i1, Int i2) ->
    if sign_int i1 = sign_int i2 && sign_int (i1 + i2) <> sign_int i1 then
      Float(float i1 +. float i2)
    else Int(i1 * i2)
  | (Int i1, Float f2) -> Float(float i1 +. f2)
  | (Float f1, Int i2) -> Float(f1 +. float i2)
  | (Float f1, Float f2) -> Float(f1 +. f2)
  | (Error, _) -> Error
  | (_, Error) -> Error

type 'a option = Some of 'a | None

let add_vect v1 v2 =
  let len = min (Array.length v1) (Array.length v2) in
  let res = Array.make len 0 in
  for i = 0 to len - 1 do
    res.(i) <- v1.(i) + v1.(i)
  done;
  res

let print_vect v =
  for i = 0 to (Array.length v) - 1 do
    print_int v.(i)
  done;
  match (Array.length v) with
  | 0 -> None
  | x -> Some x

let main () =
  concat "hello" "ocaml!!";
  print_name "ricardo";
  print_list(sort ["c"; "b"; "a"]);
  print_int (int_part (new_ratio 2 5));
  print_int (int_part (add_ratio {num=4; denom=2} {num=5; denom=3}));
  print_list_int (List.map (fun x -> x + 1) [1;2;3]);
  print_int(get_num {num=1;denom=1});
  print_int (int_part {num=4; denom=2});
  ignore(int_product 1 {num=1;denom=1});
  print_num(add_num (Int 10) (Float 3.5));
  ignore(print_vect(add_vect [| 1; 2; 3 |][| 1; 2; 3 |]));
  translate {x=1.0; y=1.0} 1.0 2.0;;

main();;

