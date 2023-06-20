// _build/default/main.js
(function(Object2) {
  typeof globalThis !== "object" && (this ? get() : (Object2.defineProperty(Object2.prototype, "_T_", {configurable: true, get}), _T_));
  function get() {
    var global = this || self;
    global.globalThis = global;
    delete Object2.prototype._T_;
  }
})(Object);
(function(globalThis2) {
  "use strict";
  function jsoo_sys_getenv(n) {
    var process = globalThis2.process;
    if (process && process.env && process.env[n] != void 0)
      return process.env[n];
    if (globalThis2.jsoo_static_env && globalThis2.jsoo_static_env[n])
      return globalThis2.jsoo_static_env[n];
  }
  var caml_record_backtrace_flag = 0;
  (function() {
    var r = jsoo_sys_getenv("OCAMLRUNPARAM");
    if (r !== void 0) {
      var l = r.split(",");
      for (var i = 0; i < l.length; i++)
        if (l[i] == "b") {
          caml_record_backtrace_flag = 1;
          break;
        } else if (l[i].startsWith("b="))
          caml_record_backtrace_flag = +l[i].slice(2);
        else
          continue;
    }
  })();
  var caml_global_data = [0];
  function caml_exn_with_js_backtrace(exn, force) {
    if (!exn.js_error || force || exn[0] == 248)
      exn.js_error = new globalThis2.Error("Js exception containing backtrace");
    return exn;
  }
  function caml_maybe_attach_backtrace(exn, force) {
    return caml_record_backtrace_flag ? caml_exn_with_js_backtrace(exn, force) : exn;
  }
  function caml_raise_with_arg(tag, arg) {
    throw caml_maybe_attach_backtrace([0, tag, arg]);
  }
  function caml_string_of_jsbytes(x) {
    return x;
  }
  function caml_raise_with_string(tag, msg) {
    caml_raise_with_arg(tag, caml_string_of_jsbytes(msg));
  }
  function caml_failwith(msg) {
    if (!caml_global_data.Failure)
      caml_global_data.Failure = [248, caml_string_of_jsbytes("Failure"), -3];
    caml_raise_with_string(caml_global_data.Failure, msg);
  }
  function jsoo_is_ascii(s) {
    if (s.length < 24) {
      for (var i = 0; i < s.length; i++)
        if (s.charCodeAt(i) > 127)
          return false;
      return true;
    } else
      return !/[^\x00-\x7f]/.test(s);
  }
  function caml_utf16_of_utf8(s) {
    for (var b = "", t = "", c, c1, c2, v, i = 0, l = s.length; i < l; i++) {
      c1 = s.charCodeAt(i);
      if (c1 < 128) {
        for (var j = i + 1; j < l && (c1 = s.charCodeAt(j)) < 128; j++)
          ;
        if (j - i > 512) {
          t.substr(0, 1);
          b += t;
          t = "";
          b += s.slice(i, j);
        } else
          t += s.slice(i, j);
        if (j == l)
          break;
        i = j;
      }
      v = 1;
      if (++i < l && ((c2 = s.charCodeAt(i)) & -64) == 128) {
        c = c2 + (c1 << 6);
        if (c1 < 224) {
          v = c - 12416;
          if (v < 128)
            v = 1;
        } else {
          v = 2;
          if (++i < l && ((c2 = s.charCodeAt(i)) & -64) == 128) {
            c = c2 + (c << 6);
            if (c1 < 240) {
              v = c - 925824;
              if (v < 2048 || v >= 55295 && v < 57344)
                v = 2;
            } else {
              v = 3;
              if (++i < l && ((c2 = s.charCodeAt(i)) & -64) == 128 && c1 < 245) {
                v = c2 - 63447168 + (c << 6);
                if (v < 65536 || v > 1114111)
                  v = 3;
              }
            }
          }
        }
      }
      if (v < 4) {
        i -= v;
        t += "\uFFFD";
      } else if (v > 65535)
        t += String.fromCharCode(55232 + (v >> 10), 56320 + (v & 1023));
      else
        t += String.fromCharCode(v);
      if (t.length > 1024) {
        t.substr(0, 1);
        b += t;
        t = "";
      }
    }
    return b + t;
  }
  function caml_jsstring_of_string(s) {
    if (jsoo_is_ascii(s))
      return s;
    return caml_utf16_of_utf8(s);
  }
  function fs_node_supported() {
    return typeof globalThis2.process !== "undefined" && typeof globalThis2.process.versions !== "undefined" && typeof globalThis2.process.versions.node !== "undefined";
  }
  function make_path_is_absolute() {
    function posix(path) {
      if (path.charAt(0) === "/")
        return ["", path.substring(1)];
      return;
    }
    function win32(path) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?([\\/])?([\s\S]*?)$/, result = splitDeviceRe.exec(path), device = result[1] || "", isUnc = Boolean(device && device.charAt(1) !== ":");
      if (Boolean(result[2] || isUnc)) {
        var root = result[1] || "", sep = result[2] || "";
        return [root, path.substring(root.length + sep.length)];
      }
      return;
    }
    return fs_node_supported() && globalThis2.process && globalThis2.process.platform ? globalThis2.process.platform === "win32" ? win32 : posix : posix;
  }
  var path_is_absolute = make_path_is_absolute();
  function caml_trailing_slash(name) {
    return name.slice(-1) !== "/" ? name + "/" : name;
  }
  if (fs_node_supported() && globalThis2.process && globalThis2.process.cwd)
    var caml_current_dir = globalThis2.process.cwd().replace(/\\/g, "/");
  else
    var caml_current_dir = "/static";
  caml_current_dir = caml_trailing_slash(caml_current_dir);
  function caml_make_path(name) {
    name = caml_jsstring_of_string(name);
    if (!path_is_absolute(name))
      name = caml_current_dir + name;
    var comp0 = path_is_absolute(name), comp = comp0[1].split("/"), ncomp = [];
    for (var i = 0; i < comp.length; i++)
      switch (comp[i]) {
        case "..":
          if (ncomp.length > 1)
            ncomp.pop();
          break;
        case ".":
          break;
        case "":
          break;
        default:
          ncomp.push(comp[i]);
          break;
      }
    ncomp.unshift(comp0[0]);
    ncomp.orig = name;
    return ncomp;
  }
  function caml_utf8_of_utf16(s) {
    for (var b = "", t = b, c, d, i = 0, l = s.length; i < l; i++) {
      c = s.charCodeAt(i);
      if (c < 128) {
        for (var j = i + 1; j < l && (c = s.charCodeAt(j)) < 128; j++)
          ;
        if (j - i > 512) {
          t.substr(0, 1);
          b += t;
          t = "";
          b += s.slice(i, j);
        } else
          t += s.slice(i, j);
        if (j == l)
          break;
        i = j;
      }
      if (c < 2048) {
        t += String.fromCharCode(192 | c >> 6);
        t += String.fromCharCode(128 | c & 63);
      } else if (c < 55296 || c >= 57343)
        t += String.fromCharCode(224 | c >> 12, 128 | c >> 6 & 63, 128 | c & 63);
      else if (c >= 56319 || i + 1 == l || (d = s.charCodeAt(i + 1)) < 56320 || d > 57343)
        t += "\xEF\xBF\xBD";
      else {
        i++;
        c = (c << 10) + d - 56613888;
        t += String.fromCharCode(240 | c >> 18, 128 | c >> 12 & 63, 128 | c >> 6 & 63, 128 | c & 63);
      }
      if (t.length > 1024) {
        t.substr(0, 1);
        b += t;
        t = "";
      }
    }
    return b + t;
  }
  function caml_string_of_jsstring(s) {
    return jsoo_is_ascii(s) ? caml_string_of_jsbytes(s) : caml_string_of_jsbytes(caml_utf8_of_utf16(s));
  }
  var unix_error = [
    "E2BIG",
    "EACCES",
    "EAGAIN",
    "EBADF",
    "EBUSY",
    "ECHILD",
    "EDEADLK",
    "EDOM",
    "EEXIST",
    "EFAULT",
    "EFBIG",
    "EINTR",
    "EINVAL",
    "EIO",
    "EISDIR",
    "EMFILE",
    "EMLINK",
    "ENAMETOOLONG",
    "ENFILE",
    "ENODEV",
    "ENOENT",
    "ENOEXEC",
    "ENOLCK",
    "ENOMEM",
    "ENOSPC",
    "ENOSYS",
    "ENOTDIR",
    "ENOTEMPTY",
    "ENOTTY",
    "ENXIO",
    "EPERM",
    "EPIPE",
    "ERANGE",
    "EROFS",
    "ESPIPE",
    "ESRCH",
    "EXDEV",
    "EWOULDBLOCK",
    "EINPROGRESS",
    "EALREADY",
    "ENOTSOCK",
    "EDESTADDRREQ",
    "EMSGSIZE",
    "EPROTOTYPE",
    "ENOPROTOOPT",
    "EPROTONOSUPPORT",
    "ESOCKTNOSUPPORT",
    "EOPNOTSUPP",
    "EPFNOSUPPORT",
    "EAFNOSUPPORT",
    "EADDRINUSE",
    "EADDRNOTAVAIL",
    "ENETDOWN",
    "ENETUNREACH",
    "ENETRESET",
    "ECONNABORTED",
    "ECONNRESET",
    "ENOBUFS",
    "EISCONN",
    "ENOTCONN",
    "ESHUTDOWN",
    "ETOOMANYREFS",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "EHOSTDOWN",
    "EHOSTUNREACH",
    "ELOOP",
    "EOVERFLOW"
  ];
  function make_unix_err_args(code, syscall, path, errno) {
    var variant = unix_error.indexOf(code);
    if (variant < 0) {
      if (errno == null)
        errno = -9999;
      variant = [0, errno];
    }
    var args = [
      variant,
      caml_string_of_jsstring(syscall || ""),
      caml_string_of_jsstring(path || "")
    ];
    return args;
  }
  var caml_named_values = {};
  function caml_named_value(nm) {
    return caml_named_values[nm];
  }
  function caml_raise_with_args(tag, args) {
    throw caml_maybe_attach_backtrace([0, tag].concat(args));
  }
  function caml_str_repeat(n, s) {
    if (n == 0)
      return "";
    if (s.repeat)
      return s.repeat(n);
    var r = "", l = 0;
    for (; ; ) {
      if (n & 1)
        r += s;
      n >>= 1;
      if (n == 0)
        return r;
      s += s;
      l++;
      if (l == 9)
        s.slice(0, 1);
    }
  }
  function caml_subarray_to_jsbytes(a, i, len) {
    var f = String.fromCharCode;
    if (i == 0 && len <= 4096 && len == a.length)
      return f.apply(null, a);
    var s = "";
    for (; 0 < len; i += 1024, len -= 1024)
      s += f.apply(null, a.slice(i, i + Math.min(len, 1024)));
    return s;
  }
  function caml_convert_string_to_bytes(s) {
    if (s.t == 2)
      s.c += caml_str_repeat(s.l - s.c.length, "\0");
    else
      s.c = caml_subarray_to_jsbytes(s.c, 0, s.c.length);
    s.t = 0;
  }
  function MlBytes(tag, contents, length) {
    this.t = tag;
    this.c = contents;
    this.l = length;
  }
  MlBytes.prototype.toString = function() {
    switch (this.t) {
      case 9:
        return this.c;
      default:
        caml_convert_string_to_bytes(this);
      case 0:
        if (jsoo_is_ascii(this.c)) {
          this.t = 9;
          return this.c;
        }
        this.t = 8;
      case 8:
        return this.c;
    }
  };
  MlBytes.prototype.toUtf16 = function() {
    var r = this.toString();
    if (this.t == 9)
      return r;
    return caml_utf16_of_utf8(r);
  };
  MlBytes.prototype.slice = function() {
    var content = this.t == 4 ? this.c.slice() : this.c;
    return new MlBytes(this.t, content, this.l);
  };
  function caml_is_ml_bytes(s) {
    return s instanceof MlBytes;
  }
  function caml_is_ml_string(s) {
    return typeof s === "string" && !/[^\x00-\xff]/.test(s);
  }
  function caml_bytes_of_array(a) {
    if (!(a instanceof Uint8Array))
      a = new Uint8Array(a);
    return new MlBytes(4, a, a.length);
  }
  function caml_bytes_of_jsbytes(s) {
    return new MlBytes(0, s, s.length);
  }
  function caml_jsbytes_of_string(x) {
    return x;
  }
  function caml_bytes_of_string(s) {
    return caml_bytes_of_jsbytes(caml_jsbytes_of_string(s));
  }
  function caml_raise_sys_error(msg) {
    caml_raise_with_string(caml_global_data.Sys_error, msg);
  }
  function caml_raise_no_such_file(name) {
    caml_raise_sys_error(name + ": No such file or directory");
  }
  function caml_convert_bytes_to_array(s) {
    var a = new Uint8Array(s.l), b = s.c, l = b.length, i = 0;
    for (; i < l; i++)
      a[i] = b.charCodeAt(i);
    for (l = s.l; i < l; i++)
      a[i] = 0;
    s.c = a;
    s.t = 4;
    return a;
  }
  function caml_uint8_array_of_bytes(s) {
    if (s.t != 4)
      caml_convert_bytes_to_array(s);
    return s.c;
  }
  function caml_invalid_argument(msg) {
    caml_raise_with_string(caml_global_data.Invalid_argument, msg);
  }
  function caml_create_bytes(len) {
    if (len < 0)
      caml_invalid_argument("Bytes.create");
    return new MlBytes(len ? 2 : 9, "", len);
  }
  function caml_ml_bytes_length(s) {
    return s.l;
  }
  function caml_blit_bytes(s1, i1, s2, i2, len) {
    if (len == 0)
      return 0;
    if (i2 == 0 && (len >= s2.l || s2.t == 2 && len >= s2.c.length)) {
      s2.c = s1.t == 4 ? caml_subarray_to_jsbytes(s1.c, i1, len) : i1 == 0 && s1.c.length == len ? s1.c : s1.c.substr(i1, len);
      s2.t = s2.c.length == s2.l ? 0 : 2;
    } else if (s2.t == 2 && i2 == s2.c.length) {
      s2.c += s1.t == 4 ? caml_subarray_to_jsbytes(s1.c, i1, len) : i1 == 0 && s1.c.length == len ? s1.c : s1.c.substr(i1, len);
      s2.t = s2.c.length == s2.l ? 0 : 2;
    } else {
      if (s2.t != 4)
        caml_convert_bytes_to_array(s2);
      var c1 = s1.c, c2 = s2.c;
      if (s1.t == 4)
        if (i2 <= i1)
          for (var i = 0; i < len; i++)
            c2[i2 + i] = c1[i1 + i];
        else
          for (var i = len - 1; i >= 0; i--)
            c2[i2 + i] = c1[i1 + i];
      else {
        var l = Math.min(len, c1.length - i1);
        for (var i = 0; i < l; i++)
          c2[i2 + i] = c1.charCodeAt(i1 + i);
        for (; i < len; i++)
          c2[i2 + i] = 0;
      }
    }
    return 0;
  }
  function MlFile() {
  }
  function MlFakeFile(content) {
    this.data = content;
  }
  MlFakeFile.prototype = new MlFile();
  MlFakeFile.prototype.constructor = MlFakeFile;
  MlFakeFile.prototype.truncate = function(len) {
    var old = this.data;
    this.data = caml_create_bytes(len | 0);
    caml_blit_bytes(old, 0, this.data, 0, len);
  };
  MlFakeFile.prototype.length = function() {
    return caml_ml_bytes_length(this.data);
  };
  MlFakeFile.prototype.write = function(offset, buf, pos, len) {
    var clen = this.length();
    if (offset + len >= clen) {
      var new_str = caml_create_bytes(offset + len), old_data = this.data;
      this.data = new_str;
      caml_blit_bytes(old_data, 0, this.data, 0, clen);
    }
    caml_blit_bytes(caml_bytes_of_array(buf), pos, this.data, offset, len);
    return 0;
  };
  MlFakeFile.prototype.read = function(offset, buf, pos, len) {
    var clen = this.length();
    if (offset + len >= clen)
      len = clen - offset;
    if (len) {
      var data = caml_create_bytes(len | 0);
      caml_blit_bytes(this.data, offset, data, 0, len);
      buf.set(caml_uint8_array_of_bytes(data), pos);
    }
    return len;
  };
  function MlFakeFd(name, file, flags) {
    this.file = file;
    this.name = name;
    this.flags = flags;
  }
  MlFakeFd.prototype.err_closed = function() {
    caml_raise_sys_error(this.name + ": file descriptor already closed");
  };
  MlFakeFd.prototype.length = function() {
    if (this.file)
      return this.file.length();
    this.err_closed();
  };
  MlFakeFd.prototype.write = function(offset, buf, pos, len) {
    if (this.file)
      return this.file.write(offset, buf, pos, len);
    this.err_closed();
  };
  MlFakeFd.prototype.read = function(offset, buf, pos, len) {
    if (this.file)
      return this.file.read(offset, buf, pos, len);
    this.err_closed();
  };
  MlFakeFd.prototype.close = function() {
    this.file = void 0;
  };
  function MlFakeDevice(root, f) {
    this.content = {};
    this.root = root;
    this.lookupFun = f;
  }
  MlFakeDevice.prototype.nm = function(name) {
    return this.root + name;
  };
  MlFakeDevice.prototype.create_dir_if_needed = function(name) {
    var comp = name.split("/"), res = "";
    for (var i = 0; i < comp.length - 1; i++) {
      res += comp[i] + "/";
      if (this.content[res])
        continue;
      this.content[res] = Symbol("directory");
    }
  };
  MlFakeDevice.prototype.slash = function(name) {
    return /\/$/.test(name) ? name : name + "/";
  };
  MlFakeDevice.prototype.lookup = function(name) {
    if (!this.content[name] && this.lookupFun) {
      var res = this.lookupFun(caml_string_of_jsbytes(this.root), caml_string_of_jsbytes(name));
      if (res !== 0) {
        this.create_dir_if_needed(name);
        this.content[name] = new MlFakeFile(caml_bytes_of_string(res[1]));
      }
    }
  };
  MlFakeDevice.prototype.exists = function(name) {
    if (name == "")
      return 1;
    var name_slash = this.slash(name);
    if (this.content[name_slash])
      return 1;
    this.lookup(name);
    return this.content[name] ? 1 : 0;
  };
  MlFakeDevice.prototype.isFile = function(name) {
    return this.exists(name) && !this.is_dir(name) ? 1 : 0;
  };
  MlFakeDevice.prototype.mkdir = function(name, mode, raise_unix) {
    var unix_error2 = raise_unix && caml_named_value("Unix.Unix_error");
    if (this.exists(name))
      if (unix_error2)
        caml_raise_with_args(unix_error2, make_unix_err_args("EEXIST", "mkdir", this.nm(name)));
      else
        caml_raise_sys_error(name + ": File exists");
    var parent = /^(.*)\/[^/]+/.exec(name);
    parent = parent && parent[1] || "";
    if (!this.exists(parent))
      if (unix_error2)
        caml_raise_with_args(unix_error2, make_unix_err_args("ENOENT", "mkdir", this.nm(parent)));
      else
        caml_raise_sys_error(parent + ": No such file or directory");
    if (!this.is_dir(parent))
      if (unix_error2)
        caml_raise_with_args(unix_error2, make_unix_err_args("ENOTDIR", "mkdir", this.nm(parent)));
      else
        caml_raise_sys_error(parent + ": Not a directory");
    this.create_dir_if_needed(this.slash(name));
  };
  MlFakeDevice.prototype.rmdir = function(name, raise_unix) {
    var unix_error2 = raise_unix && caml_named_value("Unix.Unix_error"), name_slash = name == "" ? "" : this.slash(name), r = new RegExp("^" + name_slash + "([^/]+)");
    if (!this.exists(name))
      if (unix_error2)
        caml_raise_with_args(unix_error2, make_unix_err_args("ENOENT", "rmdir", this.nm(name)));
      else
        caml_raise_sys_error(name + ": No such file or directory");
    if (!this.is_dir(name))
      if (unix_error2)
        caml_raise_with_args(unix_error2, make_unix_err_args("ENOTDIR", "rmdir", this.nm(name)));
      else
        caml_raise_sys_error(name + ": Not a directory");
    for (var n in this.content)
      if (n.match(r))
        if (unix_error2)
          caml_raise_with_args(unix_error2, make_unix_err_args("ENOTEMPTY", "rmdir", this.nm(name)));
        else
          caml_raise_sys_error(this.nm(name) + ": Directory not empty");
    delete this.content[name_slash];
  };
  MlFakeDevice.prototype.readdir = function(name) {
    var name_slash = name == "" ? "" : this.slash(name);
    if (!this.exists(name))
      caml_raise_sys_error(name + ": No such file or directory");
    if (!this.is_dir(name))
      caml_raise_sys_error(name + ": Not a directory");
    var r = new RegExp("^" + name_slash + "([^/]+)"), seen = {}, a = [];
    for (var n in this.content) {
      var m = n.match(r);
      if (m && !seen[m[1]]) {
        seen[m[1]] = true;
        a.push(m[1]);
      }
    }
    return a;
  };
  MlFakeDevice.prototype.opendir = function(name, raise_unix) {
    var unix_error2 = raise_unix && caml_named_value("Unix.Unix_error"), a = this.readdir(name), c = false, i = 0;
    return {
      readSync: function() {
        if (c)
          if (unix_error2)
            caml_raise_with_args(unix_error2, make_unix_err_args("EBADF", "closedir", this.nm(name)));
          else
            caml_raise_sys_error(name + ": closedir failed");
        if (i == a.length)
          return null;
        var entry = a[i];
        i++;
        return {name: entry};
      },
      closeSync: function() {
        if (c)
          if (unix_error2)
            caml_raise_with_args(unix_error2, make_unix_err_args("EBADF", "closedir", this.nm(name)));
          else
            caml_raise_sys_error(name + ": closedir failed");
        c = true;
        a = [];
      }
    };
  };
  MlFakeDevice.prototype.is_dir = function(name) {
    if (name == "")
      return true;
    var name_slash = this.slash(name);
    return this.content[name_slash] ? 1 : 0;
  };
  MlFakeDevice.prototype.unlink = function(name) {
    var ok = this.content[name] ? true : false;
    delete this.content[name];
    return ok;
  };
  MlFakeDevice.prototype.open = function(name, f) {
    var file;
    if (f.rdonly && f.wronly)
      caml_raise_sys_error(this.nm(name) + " : flags Open_rdonly and Open_wronly are not compatible");
    if (f.text && f.binary)
      caml_raise_sys_error(this.nm(name) + " : flags Open_text and Open_binary are not compatible");
    this.lookup(name);
    if (this.content[name]) {
      if (this.is_dir(name))
        caml_raise_sys_error(this.nm(name) + " : is a directory");
      if (f.create && f.excl)
        caml_raise_sys_error(this.nm(name) + " : file already exists");
      file = this.content[name];
      if (f.truncate)
        file.truncate();
    } else if (f.create) {
      this.create_dir_if_needed(name);
      this.content[name] = new MlFakeFile(caml_create_bytes(0));
      file = this.content[name];
    } else
      caml_raise_no_such_file(this.nm(name));
    return new MlFakeFd(this.nm(name), file, f);
  };
  MlFakeDevice.prototype.open = function(name, f) {
    var file;
    if (f.rdonly && f.wronly)
      caml_raise_sys_error(this.nm(name) + " : flags Open_rdonly and Open_wronly are not compatible");
    if (f.text && f.binary)
      caml_raise_sys_error(this.nm(name) + " : flags Open_text and Open_binary are not compatible");
    this.lookup(name);
    if (this.content[name]) {
      if (this.is_dir(name))
        caml_raise_sys_error(this.nm(name) + " : is a directory");
      if (f.create && f.excl)
        caml_raise_sys_error(this.nm(name) + " : file already exists");
      file = this.content[name];
      if (f.truncate)
        file.truncate();
    } else if (f.create) {
      this.create_dir_if_needed(name);
      this.content[name] = new MlFakeFile(caml_create_bytes(0));
      file = this.content[name];
    } else
      caml_raise_no_such_file(this.nm(name));
    return new MlFakeFd(this.nm(name), file, f);
  };
  MlFakeDevice.prototype.register = function(name, content) {
    var file;
    if (this.content[name])
      caml_raise_sys_error(this.nm(name) + " : file already exists");
    if (caml_is_ml_bytes(content))
      file = new MlFakeFile(content);
    if (caml_is_ml_string(content))
      file = new MlFakeFile(caml_bytes_of_string(content));
    else if (content instanceof Array)
      file = new MlFakeFile(caml_bytes_of_array(content));
    else if (typeof content === "string")
      file = new MlFakeFile(caml_bytes_of_jsbytes(content));
    else if (content.toString) {
      var bytes = caml_bytes_of_string(caml_string_of_jsstring(content.toString()));
      file = new MlFakeFile(bytes);
    }
    if (file) {
      this.create_dir_if_needed(name);
      this.content[name] = file;
    } else
      caml_raise_sys_error(this.nm(name) + " : registering file with invalid content type");
  };
  MlFakeDevice.prototype.constructor = MlFakeDevice;
  function caml_ml_string_length(s) {
    return s.length;
  }
  function caml_string_unsafe_get(s, i) {
    return s.charCodeAt(i);
  }
  function caml_uint8_array_of_string(s) {
    var l = caml_ml_string_length(s), a = new Array(l), i = 0;
    for (; i < l; i++)
      a[i] = caml_string_unsafe_get(s, i);
    return a;
  }
  function caml_bytes_bound_error() {
    caml_invalid_argument("index out of bounds");
  }
  function caml_bytes_unsafe_set(s, i, c) {
    c &= 255;
    if (s.t != 4) {
      if (i == s.c.length) {
        s.c += String.fromCharCode(c);
        if (i + 1 == s.l)
          s.t = 0;
        return 0;
      }
      caml_convert_bytes_to_array(s);
    }
    s.c[i] = c;
    return 0;
  }
  function caml_bytes_set(s, i, c) {
    if (i >>> 0 >= s.l)
      caml_bytes_bound_error();
    return caml_bytes_unsafe_set(s, i, c);
  }
  function MlNodeFd(fd, flags) {
    this.fs = require("fs");
    this.fd = fd;
    this.flags = flags;
  }
  MlNodeFd.prototype = new MlFile();
  MlNodeFd.prototype.constructor = MlNodeFd;
  MlNodeFd.prototype.truncate = function(len) {
    try {
      this.fs.ftruncateSync(this.fd, len | 0);
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
  };
  MlNodeFd.prototype.length = function() {
    try {
      return this.fs.fstatSync(this.fd).size;
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
  };
  MlNodeFd.prototype.write = function(offset, buf, buf_offset, len) {
    try {
      if (this.flags.isCharacterDevice)
        this.fs.writeSync(this.fd, buf, buf_offset, len);
      else
        this.fs.writeSync(this.fd, buf, buf_offset, len, offset);
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
    return 0;
  };
  MlNodeFd.prototype.read = function(offset, a, buf_offset, len) {
    try {
      if (this.flags.isCharacterDevice)
        var read = this.fs.readSync(this.fd, a, buf_offset, len);
      else
        var read = this.fs.readSync(this.fd, a, buf_offset, len, offset);
      return read;
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
  };
  MlNodeFd.prototype.close = function() {
    try {
      this.fs.closeSync(this.fd);
      return 0;
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
  };
  function MlNodeDevice(root) {
    this.fs = require("fs");
    this.root = root;
  }
  MlNodeDevice.prototype.nm = function(name) {
    return this.root + name;
  };
  MlNodeDevice.prototype.exists = function(name) {
    try {
      return this.fs.existsSync(this.nm(name)) ? 1 : 0;
    } catch (err) {
      return 0;
    }
  };
  MlNodeDevice.prototype.isFile = function(name) {
    try {
      return this.fs.statSync(this.nm(name)).isFile() ? 1 : 0;
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
  };
  MlNodeDevice.prototype.mkdir = function(name, mode, raise_unix) {
    try {
      this.fs.mkdirSync(this.nm(name), {mode});
      return 0;
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.rmdir = function(name, raise_unix) {
    try {
      this.fs.rmdirSync(this.nm(name));
      return 0;
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.readdir = function(name, raise_unix) {
    try {
      return this.fs.readdirSync(this.nm(name));
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.is_dir = function(name) {
    try {
      return this.fs.statSync(this.nm(name)).isDirectory() ? 1 : 0;
    } catch (err) {
      caml_raise_sys_error(err.toString());
    }
  };
  MlNodeDevice.prototype.unlink = function(name, raise_unix) {
    try {
      var b = this.fs.existsSync(this.nm(name)) ? 1 : 0;
      this.fs.unlinkSync(this.nm(name));
      return b;
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.open = function(name, f, raise_unix) {
    var consts = require("constants"), res = 0;
    for (var key in f)
      switch (key) {
        case "rdonly":
          res |= consts.O_RDONLY;
          break;
        case "wronly":
          res |= consts.O_WRONLY;
          break;
        case "append":
          res |= consts.O_WRONLY | consts.O_APPEND;
          break;
        case "create":
          res |= consts.O_CREAT;
          break;
        case "truncate":
          res |= consts.O_TRUNC;
          break;
        case "excl":
          res |= consts.O_EXCL;
          break;
        case "binary":
          res |= consts.O_BINARY;
          break;
        case "text":
          res |= consts.O_TEXT;
          break;
        case "nonblock":
          res |= consts.O_NONBLOCK;
          break;
      }
    try {
      var fd = this.fs.openSync(this.nm(name), res), isCharacterDevice = this.fs.lstatSync(this.nm(name)).isCharacterDevice();
      f.isCharacterDevice = isCharacterDevice;
      return new MlNodeFd(fd, f);
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.rename = function(o, n, raise_unix) {
    try {
      this.fs.renameSync(this.nm(o), this.nm(n));
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.stat = function(name, raise_unix) {
    try {
      var js_stats = this.fs.statSync(this.nm(name));
      return this.stats_from_js(js_stats);
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.lstat = function(name, raise_unix) {
    try {
      var js_stats = this.fs.lstatSync(this.nm(name));
      return this.stats_from_js(js_stats);
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.symlink = function(to_dir, target, path, raise_unix) {
    try {
      this.fs.symlinkSync(this.nm(target), this.nm(path), to_dir ? "dir" : "file");
      return 0;
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.readlink = function(name, raise_unix) {
    try {
      var link = this.fs.readlinkSync(this.nm(name), "utf8");
      return caml_string_of_jsstring(link);
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.opendir = function(name, raise_unix) {
    try {
      return this.fs.opendirSync(this.nm(name));
    } catch (err) {
      this.raise_nodejs_error(err, raise_unix);
    }
  };
  MlNodeDevice.prototype.raise_nodejs_error = function(err, raise_unix) {
    var unix_error2 = caml_named_value("Unix.Unix_error");
    if (raise_unix && unix_error2) {
      var args = make_unix_err_args(err.code, err.syscall, err.path, err.errno);
      caml_raise_with_args(unix_error2, args);
    } else
      caml_raise_sys_error(err.toString());
  };
  MlNodeDevice.prototype.stats_from_js = function(js_stats) {
    var file_kind;
    if (js_stats.isFile())
      file_kind = 0;
    else if (js_stats.isDirectory())
      file_kind = 1;
    else if (js_stats.isCharacterDevice())
      file_kind = 2;
    else if (js_stats.isBlockDevice())
      file_kind = 3;
    else if (js_stats.isSymbolicLink())
      file_kind = 4;
    else if (js_stats.isFIFO())
      file_kind = 5;
    else if (js_stats.isSocket())
      file_kind = 6;
    return [
      0,
      js_stats.dev,
      js_stats.ino,
      file_kind,
      js_stats.mode,
      js_stats.nlink,
      js_stats.uid,
      js_stats.gid,
      js_stats.rdev,
      js_stats.size,
      js_stats.atimeMs,
      js_stats.mtimeMs,
      js_stats.ctimeMs
    ];
  };
  MlNodeDevice.prototype.constructor = MlNodeDevice;
  function caml_get_root(path) {
    var x = path_is_absolute(path);
    if (!x)
      return;
    return x[0] + "/";
  }
  var caml_root = caml_get_root(caml_current_dir) || caml_failwith("unable to compute caml_root"), jsoo_mount_point = [];
  if (fs_node_supported())
    jsoo_mount_point.push({path: caml_root, device: new MlNodeDevice(caml_root)});
  else
    jsoo_mount_point.push({path: caml_root, device: new MlFakeDevice(caml_root)});
  jsoo_mount_point.push({path: "/static/", device: new MlFakeDevice("/static/")});
  function resolve_fs_device(name) {
    var path = caml_make_path(name), name = path.join("/"), name_slash = caml_trailing_slash(name), res;
    for (var i = 0; i < jsoo_mount_point.length; i++) {
      var m = jsoo_mount_point[i];
      if (name_slash.search(m.path) == 0 && (!res || res.path.length < m.path.length))
        res = {
          path: m.path,
          device: m.device,
          rest: name.substring(m.path.length, name.length)
        };
    }
    if (!res && fs_node_supported()) {
      var root = caml_get_root(name);
      if (root && root.match(/^[a-zA-Z]:\/$/)) {
        var m = {path: root, device: new MlNodeDevice(root)};
        jsoo_mount_point.push(m);
        res = {
          path: m.path,
          device: m.device,
          rest: name.substring(m.path.length, name.length)
        };
      }
    }
    if (res)
      return res;
    caml_raise_sys_error("no device found for " + name_slash);
  }
  function caml_create_file(name, content) {
    var root = resolve_fs_device(name);
    if (!root.device.register)
      caml_failwith("cannot register file");
    root.device.register(root.rest, content);
    return 0;
  }
  function jsoo_create_file(name, content) {
    var name = caml_string_of_jsbytes(name), content = caml_string_of_jsbytes(content);
    return caml_create_file(name, content);
  }
  function caml_fs_init() {
    var tmp = globalThis2.caml_fs_tmp;
    if (tmp)
      for (var i = 0; i < tmp.length; i++)
        jsoo_create_file(tmp[i].name, tmp[i].content);
    globalThis2.jsoo_create_file = jsoo_create_file;
    globalThis2.caml_fs_tmp = [];
    return 0;
  }
  var caml_ml_channels = new Array();
  function caml_ml_flush(chanid) {
    var chan = caml_ml_channels[chanid];
    if (!chan.opened)
      caml_raise_sys_error("Cannot flush a closed channel");
    if (!chan.buffer || chan.buffer_curr == 0)
      return 0;
    if (chan.output)
      chan.output(caml_subarray_to_jsbytes(chan.buffer, 0, chan.buffer_curr));
    else
      chan.file.write(chan.offset, chan.buffer, 0, chan.buffer_curr);
    chan.offset += chan.buffer_curr;
    chan.buffer_curr = 0;
    return 0;
  }
  function caml_sys_open_for_node(fd, flags) {
    if (flags.name)
      try {
        var fs = require("fs"), fd2 = fs.openSync(flags.name, "rs");
        return new MlNodeFd(fd2, flags);
      } catch (e) {
      }
    return new MlNodeFd(fd, flags);
  }
  var caml_sys_fds = new Array(3);
  function MlFakeFd_out(fd, flags) {
    MlFakeFile.call(this, caml_create_bytes(0));
    this.log = function(s) {
      return 0;
    };
    if (fd == 1 && typeof console.log == "function")
      this.log = console.log;
    else if (fd == 2 && typeof console.error == "function")
      this.log = console.error;
    else if (typeof console.log == "function")
      this.log = console.log;
    this.flags = flags;
  }
  MlFakeFd_out.prototype.length = function() {
    return 0;
  };
  MlFakeFd_out.prototype.write = function(offset, buf, pos, len) {
    if (this.log) {
      if (len > 0 && pos >= 0 && pos + len <= buf.length && buf[pos + len - 1] == 10)
        len--;
      var src = caml_create_bytes(len);
      caml_blit_bytes(caml_bytes_of_array(buf), pos, src, 0, len);
      this.log(src.toUtf16());
      return 0;
    }
    caml_raise_sys_error(this.fd + ": file descriptor already closed");
  };
  MlFakeFd_out.prototype.read = function(offset, buf, pos, len) {
    caml_raise_sys_error(this.fd + ": file descriptor is write only");
  };
  MlFakeFd_out.prototype.close = function() {
    this.log = void 0;
  };
  function caml_sys_open_internal(file, idx) {
    if (idx == void 0)
      idx = caml_sys_fds.length;
    caml_sys_fds[idx] = file;
    return idx | 0;
  }
  function caml_sys_open(name, flags, _perms) {
    var f = {};
    while (flags) {
      switch (flags[1]) {
        case 0:
          f.rdonly = 1;
          break;
        case 1:
          f.wronly = 1;
          break;
        case 2:
          f.append = 1;
          break;
        case 3:
          f.create = 1;
          break;
        case 4:
          f.truncate = 1;
          break;
        case 5:
          f.excl = 1;
          break;
        case 6:
          f.binary = 1;
          break;
        case 7:
          f.text = 1;
          break;
        case 8:
          f.nonblock = 1;
          break;
      }
      flags = flags[2];
    }
    if (f.rdonly && f.wronly)
      caml_raise_sys_error(caml_jsbytes_of_string(name) + " : flags Open_rdonly and Open_wronly are not compatible");
    if (f.text && f.binary)
      caml_raise_sys_error(caml_jsbytes_of_string(name) + " : flags Open_text and Open_binary are not compatible");
    var root = resolve_fs_device(name), file = root.device.open(root.rest, f);
    return caml_sys_open_internal(file, void 0);
  }
  (function() {
    function file(fd, flags) {
      return fs_node_supported() ? caml_sys_open_for_node(fd, flags) : new MlFakeFd_out(fd, flags);
    }
    caml_sys_open_internal(file(0, {rdonly: 1, altname: "/dev/stdin", isCharacterDevice: true}), 0);
    caml_sys_open_internal(file(1, {buffered: 2, wronly: 1, isCharacterDevice: true}), 1);
    caml_sys_open_internal(file(2, {buffered: 2, wronly: 1, isCharacterDevice: true}), 2);
  })();
  function caml_ml_open_descriptor_in(fd) {
    var file = caml_sys_fds[fd];
    if (file.flags.wronly)
      caml_raise_sys_error("fd " + fd + " is writeonly");
    var refill = null, channel = {
      file,
      offset: file.flags.append ? file.length() : 0,
      fd,
      opened: true,
      out: false,
      buffer_curr: 0,
      buffer_max: 0,
      buffer: new Uint8Array(65536),
      refill
    };
    caml_ml_channels[channel.fd] = channel;
    return channel.fd;
  }
  function caml_ml_open_descriptor_out(fd) {
    var file = caml_sys_fds[fd];
    if (file.flags.rdonly)
      caml_raise_sys_error("fd " + fd + " is readonly");
    var buffered = file.flags.buffered !== void 0 ? file.flags.buffered : 1, channel = {
      file,
      offset: file.flags.append ? file.length() : 0,
      fd,
      opened: true,
      out: true,
      buffer_curr: 0,
      buffer: new Uint8Array(65536),
      buffered
    };
    caml_ml_channels[channel.fd] = channel;
    return channel.fd;
  }
  function caml_ml_out_channels_list() {
    var l = 0;
    for (var c = 0; c < caml_ml_channels.length; c++)
      if (caml_ml_channels[c] && caml_ml_channels[c].opened && caml_ml_channels[c].out)
        l = [0, caml_ml_channels[c].fd, l];
    return l;
  }
  function caml_string_of_bytes(s) {
    s.t & 6 && caml_convert_string_to_bytes(s);
    return caml_string_of_jsbytes(s.c);
  }
  function caml_ml_output_bytes(chanid, buffer, offset, len) {
    var chan = caml_ml_channels[chanid];
    if (!chan.opened)
      caml_raise_sys_error("Cannot output to a closed channel");
    var buffer = caml_uint8_array_of_bytes(buffer);
    buffer = buffer.subarray(offset, offset + len);
    if (chan.buffer_curr + buffer.length > chan.buffer.length) {
      var b = new Uint8Array(chan.buffer_curr + buffer.length);
      b.set(chan.buffer);
      chan.buffer = b;
    }
    switch (chan.buffered) {
      case 0:
        chan.buffer.set(buffer, chan.buffer_curr);
        chan.buffer_curr += buffer.length;
        caml_ml_flush(chanid);
        break;
      case 1:
        chan.buffer.set(buffer, chan.buffer_curr);
        chan.buffer_curr += buffer.length;
        if (chan.buffer_curr >= chan.buffer.length)
          caml_ml_flush(chanid);
        break;
      case 2:
        var id = buffer.lastIndexOf(10);
        if (id < 0) {
          chan.buffer.set(buffer, chan.buffer_curr);
          chan.buffer_curr += buffer.length;
          if (chan.buffer_curr >= chan.buffer.length)
            caml_ml_flush(chanid);
        } else {
          chan.buffer.set(buffer.subarray(0, id + 1), chan.buffer_curr);
          chan.buffer_curr += id + 1;
          caml_ml_flush(chanid);
          chan.buffer.set(buffer.subarray(id + 1), chan.buffer_curr);
          chan.buffer_curr += buffer.length - id - 1;
        }
        break;
    }
    return 0;
  }
  function caml_ml_output(chanid, buffer, offset, len) {
    return caml_ml_output_bytes(chanid, caml_bytes_of_string(buffer), offset, len);
  }
  function caml_ml_output_char(chanid, c) {
    var s = caml_string_of_jsbytes(String.fromCharCode(c));
    caml_ml_output(chanid, s, 0, 1);
    return 0;
  }
  function caml_call_gen(f, args) {
    var n = f.l >= 0 ? f.l : f.l = f.length, argsLen = args.length, d = n - argsLen;
    if (d == 0)
      return f.apply(null, args);
    else if (d < 0) {
      var g = f.apply(null, args.slice(0, n));
      if (typeof g !== "function")
        return g;
      return caml_call_gen(g, args.slice(n));
    } else {
      switch (d) {
        case 1: {
          var g = function(x) {
            var nargs = new Array(argsLen + 1);
            for (var i = 0; i < argsLen; i++)
              nargs[i] = args[i];
            nargs[argsLen] = x;
            return f.apply(null, nargs);
          };
          break;
        }
        case 2: {
          var g = function(x, y) {
            var nargs = new Array(argsLen + 2);
            for (var i = 0; i < argsLen; i++)
              nargs[i] = args[i];
            nargs[argsLen] = x;
            nargs[argsLen + 1] = y;
            return f.apply(null, nargs);
          };
          break;
        }
        default:
          var g = function() {
            var extra_args = arguments.length == 0 ? 1 : arguments.length, nargs = new Array(args.length + extra_args);
            for (var i = 0; i < args.length; i++)
              nargs[i] = args[i];
            for (var i = 0; i < arguments.length; i++)
              nargs[args.length + i] = arguments[i];
            return caml_call_gen(f, nargs);
          };
      }
      g.l = d;
      return g;
    }
  }
  var caml_callback = caml_call_gen;
  function caml_build_symbols(toc) {
    var symb;
    while (toc)
      if (caml_jsstring_of_string(toc[1][1]) == "SYJS") {
        symb = toc[1][2];
        break;
      } else
        toc = toc[2];
    var r = {};
    if (symb)
      for (var i = 1; i < symb.length; i++)
        r[caml_jsstring_of_string(symb[i][1])] = symb[i][2];
    return r;
  }
  function caml_register_global(n, v, name_opt) {
    if (name_opt) {
      var name = name_opt;
      if (globalThis2.toplevelReloc)
        n = caml_callback(globalThis2.toplevelReloc, [name]);
      else if (caml_global_data.toc) {
        if (!caml_global_data.symbols)
          caml_global_data.symbols = caml_build_symbols(caml_global_data.toc);
        var nid = caml_global_data.symbols[name];
        if (nid >= 0)
          n = nid;
        else
          caml_failwith("caml_register_global: cannot locate " + name);
      }
    }
    caml_global_data[n + 1] = v;
    if (name_opt)
      caml_global_data[name_opt] = v;
  }
  function caml_register_named_value(nm, v) {
    caml_named_values[caml_jsbytes_of_string(nm)] = v;
    return 0;
  }
  function caml_wrap_exception(e) {
    {
      if (e instanceof Array)
        return e;
      var exn;
      if (globalThis2.RangeError && e instanceof globalThis2.RangeError && e.message && e.message.match(/maximum call stack/i))
        exn = caml_global_data.Stack_overflow;
      else if (globalThis2.InternalError && e instanceof globalThis2.InternalError && e.message && e.message.match(/too much recursion/i))
        exn = caml_global_data.Stack_overflow;
      else if (e instanceof globalThis2.Error && caml_named_value("jsError"))
        exn = [0, caml_named_value("jsError"), e];
      else
        exn = [0, caml_global_data.Failure, caml_string_of_jsstring(String(e))];
      if (e instanceof globalThis2.Error)
        exn.js_error = e;
      return exn;
    }
  }
  function caml_is_special_exception(exn) {
    switch (exn[2]) {
      case -8:
      case -11:
      case -12:
        return 1;
      default:
        return 0;
    }
  }
  function caml_format_exception(exn) {
    var r = "";
    if (exn[0] == 0) {
      r += exn[1][1];
      if (exn.length == 3 && exn[2][0] == 0 && caml_is_special_exception(exn[1]))
        var bucket = exn[2], start = 1;
      else
        var start = 2, bucket = exn;
      r += "(";
      for (var i = start; i < bucket.length; i++) {
        if (i > start)
          r += ", ";
        var v = bucket[i];
        if (typeof v == "number")
          r += v.toString();
        else if (v instanceof MlBytes)
          r += '"' + v.toString() + '"';
        else if (typeof v == "string")
          r += '"' + v.toString() + '"';
        else
          r += "_";
      }
      r += ")";
    } else if (exn[0] == 248)
      r += exn[1];
    return r;
  }
  function caml_fatal_uncaught_exception(err) {
    if (err instanceof Array && (err[0] == 0 || err[0] == 248)) {
      var handler = caml_named_value("Printexc.handle_uncaught_exception");
      if (handler)
        caml_callback(handler, [err, false]);
      else {
        var msg = caml_format_exception(err), at_exit = caml_named_value("Pervasives.do_at_exit");
        if (at_exit)
          caml_callback(at_exit, [0]);
        console.error("Fatal error: exception " + msg + "\n");
        if (err.js_error)
          throw err.js_error;
      }
    } else
      throw err;
  }
  function caml_setup_uncaught_exception_handler() {
    var process = globalThis2.process;
    if (process && process.on)
      process.on("uncaughtException", function(err, origin) {
        caml_fatal_uncaught_exception(err);
        process.exit(2);
      });
    else if (globalThis2.addEventListener)
      globalThis2.addEventListener("error", function(event) {
        if (event.error)
          caml_fatal_uncaught_exception(event.error);
      });
  }
  caml_setup_uncaught_exception_handler();
  var cst_Assert_failure = "Assert_failure", cst_Division_by_zero = "Division_by_zero", cst_End_of_file = "End_of_file", cst_Failure = "Failure", cst_Invalid_argument = "Invalid_argument", cst_Match_failure = "Match_failure", cst_Not_found = "Not_found", cst_Out_of_memory = "Out_of_memory", cst_Stack_overflow = "Stack_overflow", cst_Sys_blocked_io = "Sys_blocked_io", cst_Sys_error = "Sys_error", cst_Undefined_recursive_module = "Undefined_recursive_module";
  caml_fs_init();
  var Out_of_memory = [248, cst_Out_of_memory, -1], Sys_error = [248, cst_Sys_error, -2], Failure = [248, cst_Failure, -3], Invalid_argument = [248, cst_Invalid_argument, -4], End_of_file = [248, cst_End_of_file, -5], Division_by_zero = [248, cst_Division_by_zero, -6], Not_found = [248, cst_Not_found, -7], Match_failure = [248, cst_Match_failure, -8], Stack_overflow = [248, cst_Stack_overflow, -9], Sys_blocked_io = [248, cst_Sys_blocked_io, -10], Assert_failure = [248, cst_Assert_failure, -11], Undefined_recursive_module = [248, cst_Undefined_recursive_module, -12];
  caml_register_global(11, Undefined_recursive_module, cst_Undefined_recursive_module);
  caml_register_global(10, Assert_failure, cst_Assert_failure);
  caml_register_global(9, Sys_blocked_io, cst_Sys_blocked_io);
  caml_register_global(8, Stack_overflow, cst_Stack_overflow);
  caml_register_global(7, Match_failure, cst_Match_failure);
  caml_register_global(6, Not_found, cst_Not_found);
  caml_register_global(5, Division_by_zero, cst_Division_by_zero);
  caml_register_global(4, End_of_file, cst_End_of_file);
  caml_register_global(3, Invalid_argument, cst_Invalid_argument);
  caml_register_global(2, Failure, cst_Failure);
  caml_register_global(1, Sys_error, cst_Sys_error);
  caml_register_global(0, Out_of_memory, cst_Out_of_memory);
  caml_ml_open_descriptor_in(0);
  var stdout = caml_ml_open_descriptor_out(1);
  caml_ml_open_descriptor_out(2);
  function do_at_exit(param$0) {
    var param = caml_ml_out_channels_list(0);
    for (; ; ) {
      if (!param)
        return 0;
      var l = param[2], a = param[1];
      try {
        caml_ml_flush(a);
      } catch (_b_) {
        var _a_ = caml_wrap_exception(_b_);
        if (_a_[1] !== Sys_error)
          throw caml_maybe_attach_backtrace(_a_, 0);
      }
      var param = l;
    }
  }
  caml_register_named_value("Pervasives.do_at_exit", do_at_exit);
  caml_ml_output(stdout, "hello jsoo", 0, 10);
  caml_ml_output_char(stdout, 10);
  caml_ml_flush(stdout);
  do_at_exit(0);
  return;
})(globalThis);
