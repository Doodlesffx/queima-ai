'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, Eye, Clock, Utensils, Apple, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface FoodAnalysis {
  id: string
  date: string
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl?: string
}

interface DietPlan {
  id: string
  date: string
  goal: string
  totalCalories: number
  meals: Array<{
    name: string
    time: string
    foods: string[]
  }>
}

export default function HistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'food' | 'diet'>('food')
  const [foodHistory, setFoodHistory] = useState<FoodAnalysis[]>([])
  const [dietHistory, setDietHistory] = useState<DietPlan[]>([])
  const [selectedItem, setSelectedItem] = useState<FoodAnalysis | DietPlan | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const foodKey = `foodHistory_${user.id}`
      const dietKey = `dietHistory_${user.id}`
      setFoodHistory(JSON.parse(localStorage.getItem(foodKey) || '[]'))
      setDietHistory(JSON.parse(localStorage.getItem(dietKey) || '[]'))
      setPageLoading(false)
    }
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteFoodAnalysis = (id: string) => {
    if (!userId) return
    const updated = foodHistory.filter(item => item.id !== id)
    setFoodHistory(updated)
    localStorage.setItem(`foodHistory_${userId}`, JSON.stringify(updated))
  }

  const deleteDietPlan = (id: string) => {
    if (!userId) return
    const updated = dietHistory.filter(item => item.id !== id)
    setDietHistory(updated)
    localStorage.setItem(`dietHistory_${userId}`, JSON.stringify(updated))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>

            <h1 className="text-2xl font-bold">Histórico</h1>

            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('food')}
            className={`pb-4 px-4 font-medium transition-colors relative ${
              activeTab === 'food'
                ? 'text-[#00AEEF]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Apple className="w-5 h-5" />
              Análises de Comida
            </div>
            {activeTab === 'food' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00AEEF]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('diet')}
            className={`pb-4 px-4 font-medium transition-colors relative ${
              activeTab === 'diet'
                ? 'text-[#00AEEF]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Dietas Geradas
            </div>
            {activeTab === 'diet' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00AEEF]" />
            )}
          </button>
        </div>

        {/* Análises de Comida */}
        {activeTab === 'food' && (
          <div className="space-y-4">
            {foodHistory.length === 0 ? (
              <div className="text-center py-16">
                <Apple className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma análise ainda</p>
                <p className="text-gray-500 text-sm mt-2">
                  Suas análises de comida aparecerão aqui
                </p>
                <button
                  onClick={() => router.push('/calories')}
                  className="mt-6 px-6 py-3 bg-[#00AEEF] hover:bg-[#0088CC] rounded-lg font-medium transition-colors"
                >
                  Analisar Comida
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {foodHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1F1F1F] border border-gray-800 rounded-2xl p-6 hover:border-[#00AEEF]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{item.foodName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteFoodAnalysis(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Calorias:</span>
                        <span className="font-bold text-[#00AEEF]">{item.calories} kcal</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Proteína</div>
                          <div className="font-medium">{item.protein}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Carbo</div>
                          <div className="font-medium">{item.carbs}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Gordura</div>
                          <div className="font-medium">{item.fat}g</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full mt-4 py-2 border border-gray-700 rounded-lg hover:border-[#00AEEF] hover:text-[#00AEEF] transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dietas Geradas */}
        {activeTab === 'diet' && (
          <div className="space-y-4">
            {dietHistory.length === 0 ? (
              <div className="text-center py-16">
                <Utensils className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma dieta ainda</p>
                <p className="text-gray-500 text-sm mt-2">
                  Suas dietas geradas aparecerão aqui
                </p>
                <button
                  onClick={() => router.push('/diet')}
                  className="mt-6 px-6 py-3 bg-[#00AEEF] hover:bg-[#0088CC] rounded-lg font-medium transition-colors"
                >
                  Gerar Dieta
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {dietHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1F1F1F] border border-gray-800 rounded-2xl p-6 hover:border-[#00AEEF]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Dieta - {item.goal}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDietPlan(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-[#2D2D2D] rounded-lg">
                        <span className="text-gray-400">Calorias Totais:</span>
                        <span className="font-bold text-[#00AEEF]">{item.totalCalories} kcal</span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-400 font-medium">Refeições:</div>
                        {item.meals.slice(0, 3).map((meal, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-[#00AEEF] rounded-full" />
                            <span className="text-gray-300">{meal.name}</span>
                            <span className="text-gray-500">({meal.time})</span>
                          </div>
                        ))}
                        {item.meals.length > 3 && (
                          <div className="text-xs text-gray-500 ml-4">
                            +{item.meals.length - 3} refeições
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full mt-4 py-2 border border-gray-700 rounded-lg hover:border-[#00AEEF] hover:text-[#00AEEF] transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Dieta Completa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1F1F1F] border-b border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {'foodName' in selectedItem ? selectedItem.foodName : `Dieta - ${selectedItem.goal}`}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {'foodName' in selectedItem ? (
                // Detalhes de comida
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2D2D2D] rounded-lg">
                      <div className="text-sm text-gray-400">Calorias</div>
                      <div className="text-2xl font-bold text-[#00AEEF]">{selectedItem.calories} kcal</div>
                    </div>
                    <div className="p-4 bg-[#2D2D2D] rounded-lg">
                      <div className="text-sm text-gray-400">Data</div>
                      <div className="font-medium">{formatDate(selectedItem.date)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-[#2D2D2D] rounded-lg text-center">
                      <div className="text-sm text-gray-400">Proteína</div>
                      <div className="text-xl font-bold">{selectedItem.protein}g</div>
                    </div>
                    <div className="p-4 bg-[#2D2D2D] rounded-lg text-center">
                      <div className="text-sm text-gray-400">Carboidratos</div>
                      <div className="text-xl font-bold">{selectedItem.carbs}g</div>
                    </div>
                    <div className="p-4 bg-[#2D2D2D] rounded-lg text-center">
                      <div className="text-sm text-gray-400">Gorduras</div>
                      <div className="text-xl font-bold">{selectedItem.fat}g</div>
                    </div>
                  </div>
                </>
              ) : (
                // Detalhes de dieta
                <>
                  <div className="p-4 bg-[#2D2D2D] rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Objetivo</div>
                    <div className="text-lg font-bold">{selectedItem.goal}</div>
                  </div>

                  <div className="p-4 bg-[#2D2D2D] rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Calorias Totais</div>
                    <div className="text-2xl font-bold text-[#00AEEF]">{selectedItem.totalCalories} kcal</div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold">Refeições:</div>
                    {selectedItem.meals.map((meal, idx) => (
                      <div key={idx} className="p-4 bg-[#2D2D2D] rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-gray-400">{meal.time}</div>
                        </div>
                        <div className="space-y-1">
                          {meal.foods.map((food, foodIdx) => (
                            <div key={foodIdx} className="text-sm text-gray-400 flex items-center gap-2">
                              <div className="w-1 h-1 bg-[#00AEEF] rounded-full" />
                              {food}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 bg-[#00AEEF] hover:bg-[#0088CC] rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
