$(document).ready(function() {
    $('.js-example-basic-single').select2();
    
    // Function to update additional elements with N/A
    function updateAdditionalElements() {
        $('#attendance_average').html('<span class="icon">&#128100;</span><span class="element-name">N/A</span>');
        $('#assignment_completion').html('<span class="icon">&#128220;</span><span class="element-name">N/A</span>');
        $('#total_students').html('<span class="icon">&#128101;&#128102;</span><span class="element-name">N/A</span>');
    }

    // Initialize default select options and additional elements
    updateAdditionalElements();

    fetch('/api/students')
    .then(response => response.json())
    .then(data => {
        const studentsSelect = $('#names');
        const cohortsSelect = $('#cohorts');

        // Populate select options for students
        studentsSelect.append($('<option>', {
            value: '',
            text: '--- Select/search a student ---'
        }));
        data.students.forEach(student => {
            const nameEmail = `${student.name} (${student.email})`;
            studentsSelect.append(new Option(nameEmail, student.email));
        });

        // Populate select options for cohorts
        cohortsSelect.append($('<option>', {
            value: '',
            text: '--- Search/select a cohort ---'
        }));
        data.cohorts.forEach(cohort => {
            cohortsSelect.append(new Option(cohort, cohort));
        });
    })
    .catch(error => console.log(error));
    
    // Event listener for changes in the input field
    $('.js-example-basic-single').on('change', function() {
        const selectedEmail = $('#names').val();
        const selectedCohort = $('#cohorts').val();
        
        if (!selectedEmail && !selectedCohort) {
            // If no student or cohort is selected, update additional elements with N/A
            updateAdditionalElements();
        } else if (selectedEmail) {
            fetch(`/api/student/${selectedEmail}`)
            .then(response => response.json())
            .then(data => {
                // Display attendance average
                const attendanceAverage = parseFloat(data.attendanceAverage).toFixed(2);
                $('#attendance_average').html(`<span class="icon">&#128100;</span><span style="font-weight: bold; color: green;">Attendance Average (avg): ${attendanceAverage}</span>`);
                
                // Display assignment completion
                const assignmentCompletion = parseFloat(data.assignmentCompletion).toFixed(2);
                $('#assignment_completion').html(`<span class="icon">&#128220;</span><span style="font-weight: bold; color: red;">Assignment Completion (avg): ${assignmentCompletion}</span>`);
            })
            .catch(error => console.error(error));
        } else {
            // If only a cohort is selected, update additional elements with N/A
            updateAdditionalElements();
        }
    });
});
