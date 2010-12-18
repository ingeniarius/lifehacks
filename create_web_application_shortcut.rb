# encoding: utf-8
require 'fileutils'
require 'open-uri'

if ARGV.size < 2
  $stderr.puts("Usage: ruby #{$0} <AppName> <AppURL> [AppIconURL]")
  exit(1)
end

app_name = ARGV[0]
app_url = ARGV[1]
app_icon = ARGV[2]

# Chromium or Google Chrome
browser_app = "/Applications/Chromium.app/Contents/MacOS/Chromium"
#browser_app = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

# app directory
app_dir = "/Applications/#{app_name}.app"

# some app directories
user_data_dir = "#{app_dir}/Profile"
exec_dir = "#{app_dir}/Contents/MacOS"
resource_dir = "#{app_dir}/Contents/Resources"

# create directories
FileUtils.mkdir_p user_data_dir
FileUtils.mkdir_p resource_dir
FileUtils.mkdir_p exec_dir

# exec + plist
app_exec = "#{exec_dir}/#{app_name}"
plist_file = "#{app_dir}/Contents/Info.plist"

# create app icon
source_icon_url = app_icon || "#{app_url}/favicon.ico"
source_icon_file = open(source_icon_url)
if source_icon_file
  tmp_icon_path = "#{resource_dir}/icon.tmp"
  tmp_tiff_icon_path = "#{resource_dir}/icon.tiff"
  File.open(tmp_icon_path, "w") { |f| f.write(source_icon_file.read) }
  system %Q[sips -s format tiff #{tmp_icon_path} --out #{tmp_tiff_icon_path} --resampleWidth 128 >& /dev/null]
  system %Q[tiff2icns -noLarge #{resource_dir}/icon.tiff >& /dev/null]
  FileUtils.rm(tmp_icon_path)
  FileUtils.rm(tmp_tiff_icon_path)
end

# create the executable
File.open(app_exec, "w") do |f|
f.write(%Q[#!/bin/sh
exec #{browser_app} --app="#{app_url}" --user-data-dir="#{user_data_dir}" "\$@"
])
end
FileUtils.chmod 0755, app_exec

File.open(plist_file, "w") do |f|
f.write(%Q[<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" “http://www.apple.com/DTDs/PropertyList-1.0.dtd”>
<plist version=”1.0″>
<dict>
<key>CFBundleExecutable</key>
<string>#{app_name}</string>
<key>CFBundleIconFile</key>
<string>icon</string>
</dict>
</plist>])
end
FileUtils.chmod 0755, plist_file

# done!
puts "App #{app_name} (#{app_url}) was created. See Applications"