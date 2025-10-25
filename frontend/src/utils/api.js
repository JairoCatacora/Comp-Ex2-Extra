import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getHealth() {
	const response = await axios.get(`${API_BASE_URL}/health`);
	return response.data;
}

export async function parseStringLR1(grammarText, inputString) {
	const response = await axios.post(`${API_BASE_URL}/api/lr1/parse-string`, {
		grammar_text: grammarText,
		input_string: inputString
	});
	return response.data;
}