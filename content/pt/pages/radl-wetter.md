---
layout: simple.vto
indexable: true
url: '/pt/radl-wetter/'
title: 'Radl Wetter'
description: 'Radl Wetter - Verificador de janelas meteorológicas para ciclismo. Encontre as melhores condições para suas pedaladas.'
lang: 'pt'
---

# Radl Wetter - Janelas Meteorológicas para Ciclismo

Encontre as melhores janelas de tempo para suas aventuras de ciclismo. Esta ferramenta ajuda você a planejar suas pedaladas verificando as condições meteorológicas ao longo de suas rotas favoritas.

<div class="radl-weather-app">

## Como funciona

1. **Insira sua rota** - Digite um local inicial ou rota
2. **Defina suas preferências** - Escolha que condições climáticas são aceitáveis para você
3. **Encontre suas janelas** - Veja os próximos dias com condições perfeitas para pedalar

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
  <h3 class="text-lg font-semibold mb-4 text-blue-900">🚴‍♂️ Verificador de Janelas de Ciclismo</h3>
  
  <div class="space-y-4">
    <div>
      <label for="route-input" class="block text-sm font-medium text-gray-700 mb-2">Local ou Rota</label>
      <input type="text" id="route-input" placeholder="ex: München para Augsburg" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Preferências Meteorológicas</label>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-600">Temp. Mínima (°C)</label>
          <input type="range" min="0" max="30" value="15" class="w-full">
          <span class="text-xs text-gray-500">15°C</span>
        </div>
        <div>
          <label class="block text-xs text-gray-600">Chuva Máxima (%)</label>
          <input type="range" min="0" max="100" value="20" class="w-full">
          <span class="text-xs text-gray-500">20%</span>
        </div>
      </div>
    </div>
    
    <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
      Encontrar Janelas de Ciclismo
    </button>
  </div>
</div>

## Por que construí isso?

Como ciclista apaixonado que não gosta de pedalar na chuva, frequentemente me frustrava com:

- **Apps de clima muito técnicos** - Dados meteorológicos detalhados demais para planejamento simples de pedaladas
- **Apps de rota que ignoram o clima** - Excelente planejamento de rota, mas zero consideração pelas condições meteorológicas
- **Planejamento manual demorado** - Verificar clima + planejar rota + verificar múltiplos dias

## A solução

Uma ferramenta simples e em um clique que:
- ✅ Combina planejamento de rota com dados meteorológicos
- ✅ Mostra janelas de tempo perfeitas nos próximos dias
- ✅ Permite personalizar o que "tempo bom" significa para você
- ✅ Foca na facilidade de uso sobre complexidade técnica

---

*Esta é uma ferramenta em desenvolvimento. Feedback e sugestões são muito bem-vindos em [bg@benedikt-girz.com](mailto:bg@benedikt-girz.com)*