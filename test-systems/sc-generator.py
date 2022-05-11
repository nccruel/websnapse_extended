initialXCoordinate = 170
initialYCoordinate = 170

def tabFunction(n):
	content = ""
	for j in range(0, n):
			content += "\t"

	return content

def generateContent(n):
	content = "<content>\n"
	tabTracker = 1
	spikes = 1
	xCoordinate = initialXCoordinate
	yCoordinate = initialYCoordinate
	neuronList = []

	for i in range(0, n):
		neuronList.append("n{}".format(i))

	for i in range(0, n):
		content += tabFunction(tabTracker)
		content += "<{}>\n".format(neuronList[i])
		tabTracker += 1

		content += tabFunction(tabTracker)
		content += "<id>{}</id>\n".format(neuronList[i])

		content += tabFunction(tabTracker)
		content += "<position>\n"
		tabTracker += 1

		content += tabFunction(tabTracker)
		content += "<x>{}</x>\n".format(xCoordinate)
		content += tabFunction(tabTracker)
		content += "<y>{}</y>\n".format(yCoordinate)
		xCoordinate += 270
		tabTracker -= 1

		content += tabFunction(tabTracker)
		content += "</position>\n"

		content += tabFunction(tabTracker)
		content += "<rules>a*/a-&gt;a;0</rules>\n"

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

		for j in range(0, n):
			if (j != i):
				content += tabFunction(tabTracker)
				content += "<out>{}</out>\n".format(neuronList[j])

		content += tabFunction(tabTracker)
		content += "<outWeights>\n"
		tabTracker += 1

		content += tabFunction(tabTracker)
		for j in range(0, n):
			if (j != i):
				content += tabFunction(tabTracker)
				content += "<{}>1</{}>\n".format(neuronList[j], neuronList[j])
		tabTracker -= 1

		content += tabFunction(tabTracker)
		content += "</outWeights>\n"
		tabTracker -= 1

		content += tabFunction(tabTracker)
		content += "</{}>\n".format(neuronList[i])

		if ((i + 1) % 4 == 0):
			yCoordinate += 250
			xCoordinate = initialXCoordinate

	content += "</content>"

	return content


neuronNum = int(input("Input number of neurons for sc: "))

# open file
filename = "sc-{}.xmp".format(neuronNum)
f = open(filename, "w")

wholeContent = generateContent(neuronNum)

# write to file
f.write(wholeContent)
f.close()
