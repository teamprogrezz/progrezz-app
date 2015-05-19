require 'sinatra'

set :public_folder, '.'

set bind: "0.0.0.0"

get '/' do
  redirect to("/index.html")
end