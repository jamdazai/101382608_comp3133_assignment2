/**
 * @author: Jam Furaque
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})

export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  employeeForm!: FormGroup;
  selectedFile: File | null = null;
  searchDepartment = '';
  searchDesignation = '';


  
  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private http: HttpClient ) {}

  ngOnInit() {
    this.loadEmployees();
    this.initForm();
    this.makeModalDraggable();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employeePhoto: [null]
    });
  }

  makeModalDraggable() {
    setTimeout(() => {
      const modal = document.getElementById('draggableModal') as HTMLElement;
      const header = document.getElementById('modalHeader') as HTMLElement;
  
      if (!modal || !header) return;
  
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
  
      header.onmousedown = (e: MouseEvent) => {
        e.preventDefault();
        isDragging = true;
  
        const rect = modal.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        modal.style.position = 'fixed';
        modal.style.margin = '0';
        modal.style.left = `${rect.left}px`;
        modal.style.top = `${rect.top}px`;
        modal.style.transform = 'none';
      };
  
      document.onmouseup = () => {
        isDragging = false;
      };
  
      document.onmousemove = (e: MouseEvent) => {
        if (!isDragging) return;
  
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
      };
    }, 100);
  }
  

  
  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        alert('Failed to load employees. Please try again later.');
      }
    });
  }

  getEmployeePhotoUrl(photoPath: string): string {
    return environment.restApiBaseUrl + photoPath;
  }
  

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res) => {
          this.loadEmployees();
        },
        error: (err) => {
          alert('Failed to delete employee.');
        }
      });
    }
  }
  

  selectedEmployee: any = null;
  isViewModalOpen = false;
  isAddEditModalOpen = false;
  showViewModal = false;
  showAddModal = false;

  openViewModal(employee: any) {
    this.selectedEmployee = employee;
    this.isViewModalOpen = true;
  
    setTimeout(() => {
      const modal = document.getElementById('draggableModal');
      if (modal) {
        modal.style.left = '';
        modal.style.top = '';
        modal.style.position = '';
        modal.style.transform = ''; 
      }
    }, 0);
  }
  
  openAddModal() {
    this.selectedEmployee = null;
    this.isAddEditModalOpen = true;
  }

  openEditModal(employee: any) {
    this.selectedEmployee = employee;
    this.showAddModal = true;
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      gender: employee.gender,
      designation: employee.designation,
      salary: employee.salary,
      date_of_joining: employee.date_of_joining?.split('T')[0],
      department: employee.department
    });
  
    this.selectedFile = null; // clear
  }
  

  closeModals() {
    this.isViewModalOpen = false;
    this.isAddEditModalOpen = false;
    this.showViewModal = false;
    this.showAddModal = false;
    this.selectedEmployee = null;
    this.employeeForm.reset();
  }
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveEmployee(employeeInput: any) {
    if (this.selectedEmployee) {
      this.employeeService.updateEmployee(this.selectedEmployee._id, employeeInput).subscribe(() => {
        this.loadEmployees();
        this.closeModals();
      });
    } else {
      this.employeeService.createEmployee(employeeInput).subscribe(() => {
        this.loadEmployees();
        this.closeModals();
      });
    }
  }
  
  
  submitForm() {
    if (this.employeeForm.invalid) return;
  
    if (this.selectedFile) {
      const photoFormData = new FormData();
      photoFormData.append('file', this.selectedFile);
      this.http.post<{ imagePath: string }>(`${environment.restApiBaseUrl}/upload-photo`, photoFormData)
        .subscribe({
          next: (response: any) => {
            const uploadedPath = response.imagePath;
  
            const employeeInput = {
              ...this.employeeForm.value,
              employeePhoto: uploadedPath
            };
            this.saveEmployee(employeeInput);
          },
          error: (err: any) => {
            console.error('Upload error:', err);
            alert('Image upload failed');
          }
        });
    } else {
      const employeeInput = {
        ...this.employeeForm.value,
        employeePhoto: this.selectedEmployee?.employeePhoto || null
      };
      console.log('Saving employee with existing photo:', employeeInput.employeePhoto);
      this.saveEmployee(employeeInput);
    }
  }
  
  searchEmployees() {
    const input: any = {};
  
    if (this.searchDepartment.trim()) {
      input.department = this.searchDepartment.trim();
    }
    if (this.searchDesignation.trim()) {
      input.designation = this.searchDesignation.trim();
    }
  
    if (Object.keys(input).length === 0) return;
  
    this.employeeService.searchEmployeeBy(input).subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {
        console.error('Search error:', err);
        alert('Failed to search employees.');
      }
    });
  }
  
  clearSearch() {
    this.searchDepartment = '';
    this.searchDesignation = '';
    this.loadEmployees(); // Re-fetch
  }
}
