export const StringFormatter = {
  format(base: string, ...args: string[]) : string {
    var s = base; 
    for (var i = 0; i < args.length; i++) {       
      var reg = new RegExp("\\{" + i + "\\}", "gm");             
      s = s.replace(reg, args[i]);
    }
    return s;
  },
}
