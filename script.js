// elements
const mascotes = document.querySelectorAll(".mascote img");
const mapa = document.querySelector(".mapWraper");
const locais = document.querySelectorAll(".locais");
const progressCircle = document.querySelectorAll(".circle-progress");

const fala = document.getElementById("fala");
const falaText = document.querySelector(".fala h3");

const lixaoCuonter = document.querySelector(".lixaoCounter");

const painelResiduo = document.querySelector(".painelResiduo");
const painelPenalidades = document.querySelectorAll(".penalidades");

const poluicaoElem = document.querySelectorAll(".poluicao p");
const contaminacaoElem = document.querySelectorAll(".contaminacao p");

const levelElem = document.querySelectorAll(".levelLabel h3");
const levelProgress = document.querySelector(".levelProgress");

// variables
let intervalId;
let timeCounter = 0;
let currentLevel = 0;

let backupCena = 0;
let currentCena = 0;

let lixao = 0;

let selectedResiduo = null;
let selectedElement = null;

const fullCircle = 44;

const processingList = [
  [0, 13],
  [14, 16],
  [0, 10],
  [17, 18],
  [0, 18],
];
const processing = [0, 0, 0, 0]; //0 = aterro sanitário, 1 = ecoponto, 2 = centro de reciclagem, 3 = incinerador
const totalTimeProcessing = [1, 1, 1, 1];

const falas = {
  0: "Bem-vindo à ilha EcoLógica! Nosso objetivo é mantê-la limpa e sustentável. Para isso, contamos com locais de descarte específicos, preparados para processar diferentes tipos de resíduos, como papel, plástico, vidro e muito mais. Vamos embarcar nessa jornada juntos!",
  1: "Este é o Lixão. Ele aceita qualquer resíduo, mas não é o descarte ideal, pois causa problemas como a contaminação do solo e da água. Sabia que 40% dos resíduos no Brasil ainda vão para lixões, prejudicando o meio ambiente? Sempre prefira opções mais sustentáveis!",
  2: "Este é o Centro de Reciclagem. Ele processa resíduos recicláveis, sendo a opção ideal para materiais como papel, plástico, vidro e metal. Sabia que reciclar pode reduzir em até 70% o consumo de energia na produção de novos produtos? Faça sua parte e escolha o destino certo para os recicláveis!",
  3: "Este é o Aterro Sanitário. Ele aceita quase todos os resíduos e é uma alternativa mais segura que o lixão, pois reduz impactos como a contaminação do solo e da água. No entanto, alguns resíduos específicos não podem ser descartados aqui. Você consegue descobrir quais são?",
  4: "Essa é a esteira de resíduos! Aqui, você verá diversos materiais que precisam ser descartados corretamente. Seu papel é simples: clique no item que aparece e selecione o local de descarte adequado. Vamos garantir que cada resíduo encontre seu destino certo!",
  5: "Cuidado com as Barras de Penalização! Existem duas: a de Poluição e a de Contaminação. Sempre que um resíduo for descartado no local errado, essas barras aumentam. Se qualquer uma delas chegar ao limite, a ilha será prejudicada e o jogo terminará. Por isso, escolha com atenção e ajude a proteger o meio ambiente!",
  7: "Este é o Ecoponto, o local ideal para o descarte de eletrônicos como pilhas, baterias e lâmpadas. Esses itens contêm substâncias tóxicas que, quando descartadas de forma inadequada, podem poluir o solo e a água. Sabia que, se não forem reciclados corretamente, eles podem levar até 100 anos para se decompor? Fique atento! Se você colocar um resíduo errado aqui, ganhará 1 ponto de Poluição. Descarte com consciência!",
  9: "Este é o Incinerador, responsável por processar itens como seringas e resíduos hospitalares. O descarte adequado desses materiais é fundamental, pois resíduos hospitalares podem conter agentes patogênicos que representam risco à saúde pública. Sabia que o descarte incorreto de resíduos hospitalares pode causar surtos de doenças e contaminar o ambiente? Fique atento! Se você colocar um resíduo errado aqui, ganhará 1 ponto de Contaminação.",
  15: "Atenção! Você está a apenas 1 ponto do Game Over! Cada erro agora é crucial para evitar que a ilha seja prejudicada. Fique atento e faça o descarte correto para salvar o meio ambiente!",
  11: "Toda vez que um resíduo for descartado no Lixão, será causada uma penalização. Você ganhará 1 ponto de Contaminação e 1 ponto de Poluição, já que o Lixão está próximo ao lago. Sabia que o descarte inadequado pode contaminar lagos e rios, prejudicando a vida aquática e afetando o abastecimento de água de muitas comunidades? Evite essa situação e descarte corretamente!",
  13: "Cuidado! Se você descartar um resíduo incorreto no Aterro Sanitário, receberá uma penalização de 1 ponto de Poluição. Embora o Aterro aceite muitos resíduos, ele não é a opção certa para tudo. Fique atento e escolha o local adequado para cada material!",
  17: "Atenção! Quando a esteira ficar cheia, os resíduos excedentes serão enviados automaticamente para o Lixão. Evite acumular resíduos.",
  19: "Parabéns, você venceu! Com suas escolhas cuidadosas, conseguiu manter a ilha limpa e sustentável. Seu esforço fez toda a diferença para o meio ambiente, e o planeta agradece! Continue praticando a reciclagem e o descarte consciente, e lembre-se: juntos podemos cuidar do nosso mundo!",
  20: "Fim de jogo! Infelizmente, não conseguimos proteger o meio ambiente a tempo. As penalizações acumuladas foram grandes demais e a ilha foi prejudicada. Mas não se preocupe, cada erro é uma oportunidade de aprender! Vamos tentar novamente e fazer escolhas mais conscientes para garantir um futuro mais sustentável. Você consegue!",
  21: "Você foi penalizado! Esse descarte incorreto aumentou as barras de Poluição ou Contaminação. Fique atento, cada escolha errada impacta o meio ambiente e pode levar a consequências sérias. Vamos corrigir isso e fazer melhor da próxima vez!",
};

const warnings = {
  esteira: 0,
  inadequado: 0,
  generico: 0,
  penalidade: 0,
};

let pontosPoluicao = 5;
let pontosContaminacao = 5;

const residuos = [null, null, null, null, null, null, null];
const cenaFila = [];

let offsetX = 0,
  offsetY = 0,
  isDragging = false;

let deleteEle = null,
  deleteRes = null;

document.addEventListener("mousemove", (event) => {
  if (isDragging && selectedElement) {
    selectedElement.style.left = `${event.clientX - offsetX}px`;
    selectedElement.style.top = `${event.clientY - offsetY}px`;
    selectedElement.style.bottom = "auto";
  }
});

document.onmouseup = () => {
  if (selectedElement) {
    selectedElement.style.cursor = "grab";
    selectedElement.style.left = `${selectedResiduo * 130}px`;
    selectedElement.style.top = "auto";
    selectedElement.style.bottom = "20%";
    selectedElement.classList.remove("selected");
  }
  isDragging = false;
  deleteEle = selectedElement;
  deleteRes = selectedResiduo;
  selectedElement = null;
  selectedResiduo = null;
  selector(null);
};

const residuosImagens = [
  "img/lixos/residuos0.png",
  "img/lixos/residuos1.png",
  "img/lixos/residuos2.png",
  "img/lixos/residuos3.png",
  "img/lixos/residuos4.png",
  "img/lixos/residuos5.png",
  "img/lixos/residuos6.png",
  "img/lixos/residuos7.png",
  "img/lixos/residuos8.png",
  "img/lixos/residuos9.png",
  "img/lixos/residuos10.png",
  "img/lixos/residuos11.png",
  "img/lixos/residuos12.png",
  "img/lixos/residuos13.png",
  "img/lixos/residuos14.png",
  "img/lixos/residuos15.png",
  "img/lixos/residuos16.png",
  "img/lixos/residuos17.png",
  "img/lixos/residuos18.png",
];

// update dom
const penalidade = () => {
  poluicaoElem.forEach((e, i) => {
    if (i < pontosPoluicao) {
      e.style.color = "white";
      e.style.backgroundColor = "#F15B5B";

      e.classList.remove("zoomRender");
      setTimeout(() => {
        e.classList.add("zoomRender");
      }, 100);
    } else {
      e.style.color = "transparent";
      e.style.backgroundColor = "#d9d9d980";
    }
  });

  contaminacaoElem.forEach((e, i) => {
    if (i < pontosContaminacao) {
      e.style.color = "black";
      e.style.backgroundColor = "#FAEC3D";

      e.classList.remove("zoomRender");
      setTimeout(() => {
        e.classList.add("zoomRender");
      }, 100);
    } else {
      e.style.color = "transparent";
      e.style.backgroundColor = "#d9d9d980";
    }
  });

  if (
    (pontosPoluicao == 4 || pontosContaminacao == 4) &&
    !warnings["penalidade"]
  ) {
    warnings["penalidade"]++;
    cenaFila.push(15);
  }

  if (pontosPoluicao > 5 || pontosContaminacao > 5) {
    cenaFila.push(20);
  }
};

const timeProcessCounter = (i) => {
  const progress = fullCircle * (processing[i] / totalTimeProcessing[i]);
  progressCircle[i].style.strokeDashoffset = processing[i] == 1 ? 0 : progress;
  progressCircle[i].style.stroke =
    totalTimeProcessing[i] > 15 ? "#ff3d00" : "#73d673";
};

const updateLevel = () => {
  if (!(timeCounter % 20)) {
    //10s para cada subnivel
    currentLevel += 1;
    levelElem.forEach((e, i) => {
      if (i < currentLevel) {
        e.classList.add("zoomRender");
      }
    });
  }
  if (timeCounter % 2) {
    processing.forEach((e, i) => {
      if (e) {
        processing[i]--;
        timeProcessCounter(i);
        locais[i].style.filter = "grayscale(100%)";
        if (e == 1) {
          setTimeout(() => {
            progressCircle[i].style.strokeDashoffset = fullCircle;
          }, 100);
        }
      }
    });

    selector(null);
  }
  if (timeCounter == 120 || timeCounter == 180) {
    cenaFila.push(currentCena);
  }
  if (!(timeCounter % 9) && currentLevel < 16) {
    adicionarResiduo();
  }
  if (
    currentLevel >= 16 &&
    residuos.every((e) => e === null) &&
    pontosContaminacao < 5 &&
    pontosPoluicao < 5
  ) {
    cenaFila.push(19);
  }
};

const startInterval = () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      timeCounter++;
      updateLevel();
      if (cenaFila.length) {
        mudarCena(cenaFila.shift());
      }
    }, 500);
  }

  levelProgress.classList.remove("paused");
};

const pauseInterval = () => {
  clearInterval(intervalId);
  intervalId = null;

  levelProgress.classList.add("paused");
};

const random = (bias = 1.15) => {
  const random = Math.random();
  return Math.pow(random, 1 / bias);
};

const sortearResiduo = () => {
  const residuosDificuldade = [9, 14, 17, 19];
  return Math.floor(
    random() * residuosDificuldade[Math.floor(currentLevel / 4)]
  );
};

const selector = (i) => {
  if (selectedResiduo === i) {
    locais.forEach((local) => {
      local.style.cursor = "default";
      local.style.filter = "none";
      local.style.scale = "1";
    });
    return false;
  }

  locais.forEach((local, j) => {
    if (!processing[j]) {
      local.style.cursor = "pointer";
      local.style.scale = "1.1";
      local.style.filter = "none";
    } else {
      local.style.filter = "grayscale(100%)";
    }
  });
  return true;
};

const adicionarResiduo = () => {
  const i = residuos.indexOf(null);

  if (i !== -1) {
    if (i == 6 && !warnings["esteira"]) {
      cenaFila.push(17);
      warnings["esteira"]++;
    }

    e = sortearResiduo();

    const img = document.createElement("img");
    img.src = residuosImagens[e];
    img.alt = `resíduo ${e}`;

    const container = document.createElement("div");
    container.appendChild(img);
    container.style.left = `${i * 130}px`;

    painelResiduo.appendChild(container);
    container.classList.add("zoomRender");
    container.classList.add("imgContainer");
    container.onmousedown = (event) => {
      container.classList.add("selected");
      selectedElement = container;
      selectedResiduo = i;

      isDragging = true;
      selectedElement.style.cursor = "grabbing";
      offsetX = event.clientX - selectedElement.offsetLeft;
      offsetY = event.clientY - selectedElement.offsetTop;

      selector(null);
    };

    residuos[i] = e;
  } else {
    if (lixao == 0) cenaFila.push(11);
    lixao++;
    lixaoCuonter.innerText = lixao;
    pontosPoluicao += 1;
    pontosContaminacao += 1;
    penalidade();
  }
};

const process = () => {
  locais.forEach((local, i) => {
    local.onmouseenter = () => {
      if (deleteEle && !processing[i]) {
        if (i != 4) {
          if (
            residuos[deleteRes] >= processingList[i][0] &&
            residuos[deleteRes] <= processingList[i][1]
          ) {
            processing[i] = 10;
            totalTimeProcessing[i] = 10;
          } else {
            totalTimeProcessing[i] = 20;
            processing[i] = 20;
            i == 3 ? (pontosContaminacao += 1) : (pontosPoluicao += 1);
            if (!i && !warnings["inadequado"]) cenaFila.push(13);
            else if (i && !warnings["generico"]) {
              warnings["generico"] = i;
              cenaFila.push(21);
            }
            penalidade();
          }
        } else {
          if (lixao == 0) cenaFila.push(11);
          lixao++;
          lixaoCuonter.innerText = lixao;
          pontosPoluicao += 1;
          pontosContaminacao += 1;
          penalidade();
        }

        deleteEle.remove();
        residuos[deleteRes] = null;
        selector(null);
      }

      deleteEle = null;
      deleteRes = null;
    };
  });
};

const showMascote = (index) => {
  mascotes.forEach((mascote, i) => {
    if (i === index) {
      mascote.style.display = "block";
      fala.style.display = "block";
    } else {
      mascote.style.display = "none";
    }
  });

  if (index === -1) fala.style.display = "none";
};

const overlay = () => mapa.classList.toggle("overlay");

const mudarCena = (cena = currentCena) => {
  switch (cena) {
    case 0:
      falaText.innerText = falas[cena];
      currentCena++;
      break;
    case 1:
      falaText.innerText = falas[cena];
      fala.style.top = "auto";
      fala.style.bottom = "0";
      locais[4].style.display = "block";
      locais[4].style.zIndex = 20;
      locais[4].classList.add("zoomRender");
      showMascote(1);
      currentCena++;
      break;
    case 2:
      locais[4].style.zIndex = 2;
      falaText.innerText = falas[cena];

      locais[2].style.display = "block";
      locais[2].style.zIndex = 20;
      locais[2].classList.add("zoomRender");

      currentCena++;
      break;
    case 3:
      locais[2].style.zIndex = 2;
      falaText.innerText = falas[cena];

      fala.style.top = "0%";
      fala.style.bottom = "auto";
      locais[0].style.display = "block";
      locais[0].style.zIndex = 20;
      locais[0].classList.add("zoomRender");

      currentCena++;
      break;

    case 4:
      locais[0].style.zIndex = 2;
      fala.style.top = "30%";
      painelResiduo.classList.add("zoomRender");
      painelResiduo.style.zIndex = 20;
      falaText.innerText = falas[cena];
      currentCena++;
      break;

    case 5:
      painelResiduo.style.zIndex = 4;

      falaText.innerText = falas[cena];
      painelPenalidades.forEach((div, i) => {
        div.style.zIndex = 20;
        const allChildren = div.querySelectorAll("*");

        allChildren.forEach((child, j) => {
          const delay = (i * 6 + j) * 50;
          setTimeout(() => {
            child.classList.add("zoomRender");
          }, delay);
        });
      });

      setTimeout(() => {
        penalidade();
      }, 1000);
      currentCena++;
      break;
    case 6:
      pontosPoluicao = 0;
      pontosContaminacao = 0;
      penalidade();
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 4;
      });
      overlay();
      updateLevel();
      startInterval();
      showMascote(-1);
      process();
      currentCena++;
      break;
    case 7:
      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();
      locais[1].style.display = "block";
      locais[1].style.zIndex = 20;
      locais[1].classList.add("zoomRender");
      currentCena++;
      break;
    case 8:
      overlay();
      showMascote(-1);
      startInterval();
      locais[1].style.zIndex = 2;
      currentCena++;
      break;
    case 9:
      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();
      locais[3].style.display = "block";
      locais[3].style.zIndex = 20;
      locais[3].classList.add("zoomRender");
      fala.style.top = "0%";
      currentCena++;
      break;
    case 10:
      overlay();
      showMascote(-1);
      startInterval();
      fala.style.top = "30%";
      locais[3].style.zIndex = 2;
      currentCena++;
      break;
    case 15:
      overlay();
      falaText.innerText = falas[cena];
      showMascote(2);
      pauseInterval();

      painelPenalidades.forEach((div) => {
        div.style.zIndex = 20;
      });
      backupCena = currentCena;
      currentCena = cena + 1;
      break;
    case 16:
      overlay();
      showMascote(-1);
      startInterval();
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 4;
      });
      currentCena = backupCena;
      break;
    case 11:
      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();
      locais[4].style.zIndex = 20;
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 20;
      });

      backupCena = currentCena;
      currentCena = cena + 1;
      break;
    case 12:
      overlay();
      showMascote(-1);
      startInterval();
      locais[4].style.zIndex = 2;
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 4;
      });
      currentCena = backupCena;
      break;
    case 13:
      warnings["inadequado"]++;
      locais[0].style.zIndex = 20;

      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 20;
      });

      backupCena = currentCena;
      currentCena = cena + 1;
      break;
    case 14:
      locais[0].style.zIndex = 2;
      overlay();
      showMascote(-1);
      startInterval();
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 4;
      });
      currentCena = backupCena;
      break;
    case 17:
      painelResiduo.style.zIndex = 20;

      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();

      backupCena = currentCena;
      currentCena = cena + 1;
      break;
    case 18:
      painelResiduo.style.zIndex = 4;
      overlay();
      showMascote(-1);
      startInterval();
      currentCena = backupCena;
      break;
    case 19:
      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();
      fala.style.setProperty(
        "--after-content",
        '"Clique para jogar novamente ↻"'
      );
      fala.onclick = () => {
        location.reload();
      };
      break;
    case 20:
      overlay();
      falaText.innerText = falas[cena];
      showMascote(2);
      pauseInterval();
      fala.style.setProperty("--after-content", '"Clique para reiniciar ↻"');
      fala.onclick = () => {
        location.reload();
      };
      break;
    case 21:
      locais[warnings["generico"]].style.zIndex = 20;

      if (warnings["generico"] == 2) {
        fala.style.top = "auto";
        fala.style.bottom = "0";
      }

      overlay();
      falaText.innerText = falas[cena];
      showMascote(1);
      pauseInterval();
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 20;
      });
      backupCena = currentCena;
      currentCena = cena + 1;
      break;
    case 22:
      locais[warnings["generico"]].style.zIndex = 2;
      overlay();
      showMascote(-1);
      startInterval();
      if (warnings["generico"] == 2) {
        fala.style.top = "30%";
        fala.style.bottom = "auto";
      }
      painelPenalidades.forEach((div) => {
        div.style.zIndex = 4;
      });
      currentCena = backupCena;
      break;
    default:
      break;
  }
};

showMascote(0);
fala.onclick = () => mudarCena();
