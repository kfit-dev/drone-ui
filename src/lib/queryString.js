
const encode = encodeURIComponent;

export default function queryString(query) {
  let output = "";

  Object.keys(query).forEach(key => {
    if (query[key] && output.length) output += "&";
    if (query[key]) output += encode(key) + '=' + encode(query[key])
  });

  return output
}