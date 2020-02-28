function Algorithm(type, strategy) {
    this.type = type;
    this.strategy = strategy;
    this.dataSetSize = document.getElementById("dataset_size").value || 10;
    this.title = this.strategy + " " + this.type;

    this.changeSpeed = () => {
        return parseInt(document.getElementById('speed').dataset.seconds);
    }

    this.timeDelay = async (speed) => {
        return new Promise(resolve =>
            setTimeout(() => {
              resolve();
            }, speed)
          );
    }

    this.disableInputs = function () { 
        document.querySelectorAll("#elToFind, .algorithm_link, #generate, #dataset_size, #search_button, #sort").forEach(element => {
          switch (element.tagName.toLowerCase()) {
            case "a":
              element.classList.add("disabled")
              break;
            case "button":
            case "input":
              element.setAttribute("disabled", true)
              break;
          }
        })
      }
    
    this.enableInputs = function () { 
        document.querySelectorAll("#elToFind, .algorithm_link, #generate, #dataset_size, #search_button, #sort").forEach(element => {
            switch (element.tagName.toLowerCase()) {
            case "a":
                element.classList.remove("disabled")
                break;
            case "button":
            case "input":
                element.removeAttribute('disabled')
                break;
            }
        })
    }

    this.generateRandomDataSet = function (size) {
        let dataset = []
        for (let i = 0; i < size; i++) {
          let newElem = Math.floor(Math.random() * 200) + 3;
          while (dataset.lastIndexOf(newElem) !== -1) {
            newElem = Math.floor(Math.random() * 200) + 3;
          }
          dataset.push(newElem)
        }
        return (this.title == "Binary Search") ? dataset.sort(function (a, b) { return a - b }) : dataset;
    }

    this.dataset = this.generateRandomDataSet(this.dataSetSize);

    
    
    this.find = function (element) {
        this.disableInputs()
        document.getElementById("result").innerHTML = "Searching..."
        switch (this.title) {
          case "Linear Search":
            let linear_search_index = 0;
            let found = false;
            document.getElementById("result").innerHTML = ""
            let linearSearchInterval = setInterval(() => {
                            document.querySelector(".array_elem[data-value='" + this.dataset[linear_search_index] + "']").classList.add('highlight')
              if (this.dataset[linear_search_index] == element) {
                                document.querySelector(".array_elem[data-value='" + this.dataset[linear_search_index] + "']").classList.add('found')
                document.getElementById("result").innerHTML = "The searched element <span class='searchedElement'>" + element + "</span> found at index <span class='searchIndex'>" + linear_search_index + "</span>";
                found = true
                this.enableInputs()
                clearInterval(linearSearchInterval)
              } else {
                document.querySelector(".array_elem[data-value='" + this.dataset[linear_search_index] + "']").classList.add('completed')
                document.getElementById("search_button").removeAttribute("disabled")
              }
              if (linear_search_index == this.dataset.length - 1) {
                clearInterval(linearSearchInterval)
                if (!found) {
                                    this.enableInputs()
                  document.getElementById("result").innerHTML = "The searched element <span class='searchedElement notFound'>" + element + "</span> not found in the array";
                }
              } else {
                linear_search_index++
              }
            }, this.changeSpeed());
            break;
          case "Binary Search":
            let lowIndex = 0;
            let highIndex = this.dataset.length - 1;
            document.querySelector(".array_elem[data-index='" + lowIndex + "']").setAttribute("data-search-index", 'low')
            document.querySelector(".array_elem[data-index='" + highIndex + "']").setAttribute("data-search-index", 'high')
            document.getElementById("result").innerHTML = ""
            let binarySearchInterval = setInterval(() => {
                            if (lowIndex <= highIndex) {
                    
                let midIndex = Math.floor((lowIndex + highIndex) / 2);
    
                document.querySelectorAll(".array_elem[data-search-index='mid']").forEach((element) => element.removeAttribute("data-search-index"))
                document.querySelector(".array_elem[data-index='" + midIndex + "']").setAttribute("data-search-index", 'mid')
    
                if (this.dataset[midIndex] == element) {
                                    document.querySelector(".array_elem[data-value='" + this.dataset[midIndex] + "']").classList.add('found')
                  document.getElementById("result").innerHTML = "The searched element <span class='searchedElement'>" + element + "</span> found at index <span class='searchIndex'>" + midIndex + "</span>";
                  document.getElementById("search_button").removeAttribute("disabled")
                  clearInterval(binarySearchInterval)
                  this.enableInputs()
                } else if (this.dataset[midIndex] < element) {
                                    lowIndex = midIndex + 1;
                  document.querySelectorAll(".array_elem[data-search-index='low']").forEach((element) => element.removeAttribute("data-search-index"))
                  document.querySelector(".array_elem[data-index='" + lowIndex + "']").setAttribute("data-search-index", 'low')
                  for (let c_index = 0; c_index < lowIndex; c_index++) {
                    document.querySelectorAll(".array_elem[data-index='" + c_index + "']").forEach((c_element) => c_element.classList.add("completed"))
                  }
                } else {
                  
                  highIndex = midIndex - 1;
                  document.querySelectorAll(".array_elem[data-search-index='high']").forEach((element) => element.removeAttribute("data-search-index"))
                  document.querySelector(".array_elem[data-index='" + highIndex + "']").setAttribute("data-search-index", 'high')
                  for (let c_index = midIndex + 1; c_index < highIndex; c_index++) {
                    document.querySelectorAll(".array_elem[data-index='" + c_index + "']").forEach((c_element) => c_element.classList.add("completed"))
                  }
                  if (highIndex < (this.dataset.length - 1)) {
                    for (let c_index = highIndex + 1; c_index < this.dataset.length; c_index++) {
                      document.querySelectorAll(".array_elem[data-index='" + c_index + "']").forEach((c_element) => c_element.classList.add("completed"))
                    }
                  }
                }
              } else {
                clearInterval(binarySearchInterval)
                
                this.enableInputs()
                document.getElementById("result").innerHTML = "The searched element <span class='searchedElement notFound'>" + element + "</span> not found in the array";
              }
            }, this.changeSpeed());
            break;
        }
    }
    
    this.sort = async () => {
        this.disableInputs()
        document.getElementById("result").innerHTML = "Sorting..."
        let barElements = document.querySelectorAll('.bars .bar')
        switch (this.title) {
          case "Selection Sort":
                        for (let index1 = 0; index1 < this.dataset.length; index1++) {
                            let min = index1;
                            for (let index2 = index1 + 1; index2 < this.dataset.length; index2++) {
                document.querySelectorAll('.bar:not(.min)').forEach((element) => element.classList.remove('highlighted'))
                barElements[index2].classList.add("highlighted")
                await this.delay(this.changeSpeed() / 2)
                                if (this.dataset[min] > this.dataset[index2]) {
                                    min = index2
                  document.querySelectorAll('.bar.min').forEach((element) => element.className = 'bar')
                  barElements[min].className += " highlighted min"
                }
              }
    
              
              if (min !== index1) {
                
                let tmp = this.dataset[index1];
                
                this.dataset[index1] = this.dataset[min];
                
                this.dataset[min] = tmp;
                loadBars(this.dataset, false, false)
                barElements = document.querySelectorAll('.bars .bar')
              }
    
              for (let index = 0; index <= index1 ; index++) {
                barElements[index].classList.add("completed")
              }
    
              if (index1 == this.dataset.length - 1) {
                
                barElements.forEach((element) => element.classList.add('completed'))
                document.getElementById("result").innerHTML = "The data is sorted.";
              }
            }
            break;
          case "Bubble Sort":
                        for (let index1 = 0; index1 < this.dataset.length - 1; index1++) {
                            for (let index2 = 0; index2 < (this.dataset.length - index1) - 1; index2++) {
                                barElements.forEach((element) => element.classList.remove('highlighted'))
                barElements[index2].classList.add('highlighted')
                barElements[index2 + 1].classList.add('highlighted')
    
                await this.delay(this.changeSpeed() / 2)
    
                if (this.dataset[index2] > this.dataset[index2 + 1]) {
                                    let tmp = this.dataset[index2];
                                    this.dataset[index2] = this.dataset[index2 + 1];
                                    this.dataset[index2 + 1] = tmp;
                  let previous_bar = document.querySelectorAll('.bar.completed')
                  let previous_completed_value
                  if (previous_bar.length > 0) previous_completed_value = previous_bar[0].dataset.value
                  loadBars(this.dataset, false, false, false)
                  barElements = document.querySelectorAll('.bars .bar')
                  if (previous_completed_value) {
                    let previous_comlpeted_index = document.querySelector('.bar[data-value="' + Number(previous_completed_value) + '"]').dataset.index
                    for (let index = previous_comlpeted_index; index < this.dataset.length; index++) {
                      barElements[index].classList.add('completed')
                    }
                  }
                }
              }
              for (let index = (barElements.length - index1 - 1); index < this.dataset.length; index++) {
                barElements[index].classList.add('completed')
              }
    
              if (index1 == this.dataset.length - 2) {
                
                barElements.forEach((element) => element.classList.add('completed'))
                document.getElementById("result").innerHTML = "The data is sorted.";
              }
            }
            break;
        }
    
        this.enableInputs()
    }
    
    this.data = function () {
        return {
            type: this.type,
            title: this.title,
            dataset: this.dataset
        }
    }
}




function loadArray(array) {
    let array_wrap = document.querySelector(".array_wrap");
    array_wrap.innerHTML = ""
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      let arrayElemDiv = document.createElement("div");
      arrayElemDiv.className += "array_elem";
      arrayElemDiv.setAttribute("data-value", element)
      arrayElemDiv.setAttribute("data-index", index)
      arrayElemDiv.setAttribute("data-search-index", "")
      let arrayElem = document.createTextNode(element);
      arrayElemDiv.appendChild(arrayElem);
      array_wrap.appendChild(arrayElemDiv)
    }
  }


function loadData() {
    let algorithm = new Algorithm(window.currentAlgData.algType, window.currentAlgData.strategy)
    window.currentAlgorithm = algorithm;
    let algorithm_data = algorithm.data()
    let array_wrap = document.getElementsByClassName("array_wrap")[0];
    let bar_lines_wrap = document.getElementsByClassName("bars")[0];
    array_wrap.innerHTML = ""
    bar_lines_wrap.innerHTML = ""
    if (algorithm_data.type == "Sort") {
      loadBars(currentAlgorithm.dataset, true, false)
    } else {
      bar_lines_wrap.classList.add("hide")
      loadArray(currentAlgorithm.dataset)
    }
  
  }


window.addEventListener("load", function () {
  
    let algorithm_links = document.getElementsByClassName("algorithm_link")
  
    for (let i = 0; i < algorithm_links.length; i++) {
      const element = algorithm_links[i];
  
      element.addEventListener("click", function (event) {
        event.preventDefault();
        $this = this
        document.querySelectorAll(".algorithm_link").forEach((element) => element.classList.remove("active"))
        element.classList.add('active')
  
        window.currentAlgData = {
          algType: this.dataset.algType,
          strategy: this.dataset.strategy
        }
        document.getElementById("result").innerHTML = ''
        if (this.dataset.algType != "Search") {
          document.getElementById("sort").classList.remove('hide')
          document.querySelector(".search_form").classList.add('hide')
        } else {
          document.getElementById("sort").classList.add('hide')
          document.querySelector(".search_form").classList.remove('hide')
        }
  
        document.getElementById("code_wrap").classList.add("minimized")
  
        document.querySelectorAll(".algorithm_name").forEach((element) => element.innerText = ($this.dataset.strategy + " " + $this.dataset.algType))
        document.querySelector('.visual_area').classList.add((this.dataset.strategy + "_" + this.dataset.algType).toLowerCase())
        document.getElementById("generate").click()
      })
    }
  
    document.getElementById("generate").addEventListener("click", loadData, false);
  
    document.getElementById("dataset_size").addEventListener("keyup", function (event) {
      event.preventDefault()
      if (this.value > 100) {
        this.value = 100
      }
      if (event.keyCode == 13) {
        document.getElementById("generate").click()
      }
    });
  
    document.getElementById("elToFind").addEventListener("keyup", function (event) {
      event.preventDefault()
      if (event.keyCode == 13) {
        document.getElementById("search_button").click()
      }
    });
  
    document.getElementById("search_button").addEventListener("click", function (event) {
      event.preventDefault()
      let elToFind = document.getElementById("elToFind").value
      document.querySelectorAll(".array_elem").forEach((element) => {
        element.classList.remove("found")
        element.classList.remove("completed")
        element.classList.remove("highlight")
      })
      currentAlgorithm.find(elToFind)
    })
  
    document.getElementById("speed").addEventListener("click", function (event) {
      switch (this.innerText) {
        case "1Ã—":
          this.innerText = "2Ã—"
          this.setAttribute("data-seconds", 1000 / 2)
          break;
        case "2Ã—":
          this.innerText = "5Ã—"
          this.setAttribute("data-seconds", 1000 / 5)
          break;
        case "5Ã—":
          this.innerText = "10Ã—"
          this.setAttribute("data-seconds", 1000 / 10)
          break;
        case "10Ã—":
          this.innerText = "1Ã—"
          this.setAttribute("data-seconds", 1000)
          break;
      }
    })
  
    document.querySelector(".resizer").addEventListener("click", function (event) {
      if (this.parentElement.classList.contains("minimized")) {
        this.parentElement.classList.remove("minimized")
      } else {
        this.parentElement.classList.add("minimized")
      }
    });
  
    document.getElementById("sort").addEventListener("click", function (event) {
      event.preventDefault()
      currentAlgorithm.sort()
    })
  
    algorithm_links[0].click();
})