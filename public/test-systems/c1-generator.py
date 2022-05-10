def tabFunction(n):
	content = ""
	for j in range(0, n):
			content += "\t"

	return content

def generateContent(n):
	content = "<content>\n"
	tabTracker = 1
	spikes = 1
	xCoordinate = 181
	yCoordinate = 133.5

	for i in range(0, n - 1):
		content += tabFunction(tabTracker)
		content += "<n{}>\n".format(i)
		tabTracker += 1

		content += tabFunction(tabTracker)
		content += "<id>n{}</id>\n".format(i)

		content += tabFunction(tabTracker)
		content += "<position>\n"
		tabTracker += 1

		content += tabFunction(tabTracker)
		content += "<x>{}</x>\n".format(xCoordinate)
		content += tabFunction(tabTracker)
		content += "<y>{}</y>\n".format(yCoordinate)
		xCoordinate += 180
		tabTracker -= 1

		content += tabFunction(tabTracker)
		content += "</position>\n"

		content += tabFunction(tabTracker)
		content += "<rules>a/a-&gt;a;0</rules>\n"

		content += tabFunction(tabTracker)
		content += "<startingSpikes>{}</startingSpikes>\n".format(spikes)

		content += tabFunction(tabTracker)
		content += "<delay>0</delay>\n"

		content += tabFunction(tabTracker)
		content += "<spikes>{}</spikes>\n".format(spikes)

		content += tabFunction(tabTracker)
		content += "<isOutput>false</isOutput>\n"

		content += tabFunction(tabTracker)
		content += "<isInput>false</isInput>\n"

		content += tabFunction(tabTracker)
		out = "outNeuron" if i == (n - 2) else "n{}".format(i + 1)
		content += "<out>{}</out>\n".format(out)

		content += tabFunction(tabTracker)
		content += "<outWeights>\n"
		tabTracker += 1

		content += tabFunction(tabTracker)
		content += "<{}>1</{}>\n".format(out, out)
		tabTracker -= 1

		content += tabFunction(tabTracker)
		content += "</outWeights>\n"
		tabTracker -= 1

		content += tabFunction(tabTracker)
		content += "</n{}>\n".format(i)


		if ((i + 1) % 50 == 0):
			yCoordinate += 250
			xCoordinate = 181
		spikes = 0
		
	content += tabFunction(tabTracker)
	content += "<outNeuron>\n"
	tabTracker += 1

	content += tabFunction(tabTracker)
	content += "<id>outNeuron</id>\n"	
	content += tabFunction(tabTracker)
	content += "<position>\n"
	tabTracker += 1

	content += tabFunction(tabTracker)
	content += "<x>{}</x>\n".format(xCoordinate)
	content += tabFunction(tabTracker)
	content += "<y>{}</y>\n".format(yCoordinate)
	tabTracker -= 1

	content += tabFunction(tabTracker)
	content += "</position>\n"

	content += tabFunction(tabTracker)
	content += "<isOutput>true</isOutput>\n"

	content += tabFunction(tabTracker)
	content += "<spikes>0</spikes>\n"

	content += tabFunction(tabTracker)
	content += "<bitstring> </bitstring>\n"
	tabTracker -= 1

	content += tabFunction(tabTracker)
	content += "</outNeuron>\n"
	tabTracker -= 1

	content += "</content>"

	return content


neuronNum = int(input("Input number of neurons for c1: "))

# open file
filename = "c1-{}.xmp".format(neuronNum)
f = open(filename, "w")

wholeContent = generateContent(neuronNum)

# write to file
f.write(wholeContent)
f.close()
