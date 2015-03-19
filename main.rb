require 'sinatra'

before do
  headers['Access-Control-Allow-Methods'] = 'GET' # , POST'
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Headers'] = 'accept, authorization, origin, content-type'
  headers['Access-Control-Allow-Credentials'] = 'false'
end

#set bind: "0.0.0.0"

get '/' do
  redirect to("/index.html")
end