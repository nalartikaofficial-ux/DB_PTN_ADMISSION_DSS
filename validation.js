/**
 * Frontend Input Validation Layer
 */
const Validation = {
  validateStudentProfile: function(student) {
    const errors = [];
    if (!student.nama || student.nama.trim() === "") errors.push("Nama siswa wajib diisi.");
    if (!student.kelas || student.kelas.trim() === "") errors.push("Kelas wajib diisi.");
    if (!student.jurusan || student.jurusan.trim() === "") errors.push("Rumpun jurusan wajib dipilih.");
    
    if (student.ranking) {
      const r = Number(student.ranking);
      const t = Number(student.total_siswa);
      if (isNaN(r) || r < 1) errors.push("Peringkat harus bernilai angka positif.");
      if (t && r > t) errors.push("Peringkat tidak boleh melebihi total siswa.");
    }
    return errors;
  }
};
