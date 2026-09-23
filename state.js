/**
 * Central State Store
 */
const AppState = {
  student: {
    nama: "",
    nis: "",
    kelas: "",
    jurusan: "",
    ranking: null,
    total_siswa: null
  },
  grades: [],
  utbk: [
    { tryout_number: 1, total_score: null },
    { tryout_number: 2, total_score: null },
    { tryout_number: 3, total_score: null }
  ],
  programs: [],
  selectedTarget1: null,
  selectedTarget2: null,
  recommendations: [],
  config: {},
  loading: false,
  activePathway: "SNBP"
};
