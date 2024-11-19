// import lib
crypto = include_lib("/lib/crypto.so")

banner = "                                                                                     
 _           _                      _  __ _ 
| |         | |                    (_)/ _(_)
| |__   __ _| |__  _   _  __      ___| |_ _ 
| '_ \ / _` | '_ \| | | | \ \ /\ / / |  _| |
| |_) | (_| | |_) | |_| |  \ V  V /| | | | |
|_.__/ \__,_|_.__/ \__, |   \_/\_/ |_|_| |_|
                    __/ |                   
                   |___/                   

                   - Made with love : Vedant Kanoujia
				   - github : https://github.com/fatherofphysics 
"

// enable monitor mode
monitor_mode = function()
	airmonResult = crypto.airmon("start", "wlan0")
	if typeof(airmonResult) == "string" then
   		print("There was an error while switching monitoring mode: " + airmonResult)
	else
   		print("Monitoring mode enabled successfully.")
	end if
end function

clear_screen
print(banner)
monitor_mode()

print("Wifi network list\nNo.    BSSID         PWR ESSID")
networks = get_shell.host_computer.wifi_networks("wlan0")
for index in range(0, networks.len -1)
	print(index + ". " + networks[index])
end for

// select target wifi
selected_network = user_input("select wifi ").to_int
if (typeof(selected_network) == "string" or selected_network < 0 or selected_network > networks.len -1) then
    exit("wrong input")
end if

// selected target wifi
parsed = networks[selected_network].split(" ")
bssid = parsed[0]
pwr = parsed[1][:-1].to_int
essid = parsed[2]
potentialAcks = 300000 / (pwr+1) // prevent divide by 0
print("You selected Wi-fi: "+ essid + " (BSSID: " + bssid + ")")
capFile = ("/home/" + active_user + "/file.cap")
hostFile = get_shell.host_computer.File(capFile)

if (hostFile != null and (hostFile.is_binary != null) and (hostFile.is_binary == 1)) then
	exit("file already exists and ready for processing.\nTo crack Wi-Fi passwords, run:\naircrack file.cap")
end if

start = time
crypto.aireplay(bssid, essid, potentialAcks)
wifiPasswd = crypto.aircrack(capFile)
endTime = time - start
print("Cracking done within: " + endTime*1000 + "sec")
print("Wifi password for " + essid + " is " + wifiPasswd)
