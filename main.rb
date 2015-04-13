require 'sinatra'

set bind: "0.0.0.0"

get '/' do
  redirect to("/index.html")
end