import json

def test_professor_materias(app, client):
    res = client.post('/professores/materias',json={'tiaProfessor':'12345678'})
    assert res.status_code == 200
    expected = '[{"_id": {"$oid": "613cd9c81d90c02257c7c160"}, "nomeMateria": "Laboratorio de Engenharia de Sofware 06N11", "professores": [{"$oid": "613ccbbe1d90c02257c7c15e"}]}, {"_id": {"$oid": "613d6cc21d90c02257c7c166"}, "nomeMateria": "Laboratorio de Engenharia de Sofware 06M11", "professores": [{"$oid": "613ccbbe1d90c02257c7c15e"}]}]'
    assert expected == json.loads(res.get_data(as_text=True))