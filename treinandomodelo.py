import json

# Carregar o dataset original
with open("C:/Users/famil/Downloads/FoodData_Central_foundation_food_json_2024-10-31/foundationDownload.json", "r") as f:
    data = json.load(f)

# Estruturar o novo dataset
formatted_data = []
for food in data["FoundationFoods"]:
    description = food.get("description", "Alimento desconhecido")
    for nutrient in food.get("foodNutrients", []):
        nutrient_name = nutrient["nutrient"]["name"]
        amount = nutrient.get("amount", "N/A")
        unit = nutrient["nutrient"]["unitName"]
        if amount != "N/A":
            question = f"Quantos {unit} de {nutrient_name} existem em 100g de {description}?"
            answer = f"100g de {description} contêm {amount}{unit} de {nutrient_name}."
            formatted_data.append({"input": question, "output": answer})

# Salvando o dataset corretamente codificado
with open("formatted_dataset.jsonl", "w", encoding="utf-8") as f:
    for entry in formatted_data:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

print("Dataset formatado com sucesso!")
