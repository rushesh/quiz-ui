import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private fb: FormBuilder, private toastr: ToastrService) {}
  quizForm1!: FormGroup;
  quizForm2!: FormGroup;
  totalForm!: FormGroup;
  total = 4;
  cuurentQues1 = 1;
  correctCounter1 = 0;
  cuurentQues2 = 1;
  correctCounter2 = 0;
  exp1 = '';
  exp2 = '';
  hideForm1 = false;
  showQuiz1 = false;
  hideForm2 = false;
  showQuiz2 = false;
  enableEditPreference = false;
  operators = ['+', '-', '*', '/', '%'];
  max = 10;
  allComputations: any = [];
  ngOnInit() {
    this.totalForm = this.fb.group({
      rangeMax: [
        10,
        [Validators.required, Validators.min(10), Validators.max(100)],
      ],
      total: [
        20,
        [
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.min(5),
          Validators.max(20),
        ],
      ],
    });
  }
  onSubmittotalForm(form: FormGroup): any {
    this.enableEditPreference = true;
    this.total = form.value.total;
    this.max = form.value.rangeMax;
    this.totalForm.disable();
    this.toastr.info(`Total Questions : ${this.total}`, 'Preferences are');
    this.toastr.info(`Max Range Value : ${this.max}`, 'Max value');
  }
  onEditPreference(): any{
    if(!(this.showQuiz1 && this.showQuiz2)){
      this.totalForm.enable();
      this.toastr.success('Preferences enabled for edit');
    } else {
      this.toastr.error('Preferences cannot be set once quiz started');
    }
  }
  generateRandomExpression(): any {
    try {
      let n1 = Math.floor(Math.random() * this.max+1).toString();
    let n2 = Math.floor(Math.random() * this.max+1).toString();
    const o1 = Math.floor(Math.random() * (this.operators.length));
    const ope = this.operators[o1];
    if(ope == '-' && (n1<n2)){
        [n1,n2] = [n2,n1]
    }
    else if(ope=='/' && n2=="0"){
      n2 = (Math.floor(Math.random() * this.max+1) + (this.max)/2).toString();
    }
    const s = `${n1} ${ope} ${n2}`;
    return s;
    } catch (error) {
      const s = `0 + ${this.max}`;
      return s;
    }
    
  }
  onSubmit1(form1: FormGroup) {
    const correctResIs = eval(this.exp1).toFixed(2);
    const userEnteredResultIs = form1.value.result1.toFixed(2);
    if (correctResIs == userEnteredResultIs) {
      this.correctCounter1 += 1;
    }
    const obj = {
        expression: this.exp1,
        result: userEnteredResultIs,
        correctresult: correctResIs,
        iscorrect: (correctResIs == userEnteredResultIs)
    };
    this.allComputations.push(obj);
    this.exp1 = this.generateRandomExpression();
    this.quizForm1.setValue({ result1: '' });

    if (this.cuurentQues1 >= this.total) {
      this.hideForm1 = true;
      this.toastr.success(
        `Correct Ans : ${this.correctCounter1} out of ` + this.total.toString(),
        'Current Score Quiz 1'
      );
    } else {
      this.cuurentQues1 += 1;
    }
  }
  onSubmit2(form1: FormGroup) {
    const correctResIs = eval(this.exp2).toFixed(2);
    const userEnteredResultIs = form1.value.result2.toFixed(2);
    if (correctResIs == userEnteredResultIs) {
      this.correctCounter2 += 1;
    }
    const obj = {
        expression: this.exp2,
        result: userEnteredResultIs,
        correctresult: correctResIs,
        iscorrect: (correctResIs == userEnteredResultIs)
    };
    this.allComputations.push(obj);
    this.exp2 = this.generateRandomExpression();
    this.quizForm2.setValue({ result2: '' });

    if (this.cuurentQues2 >= this.total) {
      this.hideForm2 = true;
      this.toastr.success(
        `Correct Ans : ${this.correctCounter2} out of ` + this.total.toString(),
        'Current Score Quiz 2'
      );
      this.enableEditPreference = true;
    } else {
      this.cuurentQues2 += 1;
    }
  }

  restart(formNo: any): any {
    this.allComputations = [];
    if (formNo == '1') {
      this.hideForm1 = false;
      this.exp1 = this.generateRandomExpression();
      this.quizForm1.setValue({ result1: '' });
      this.correctCounter1 = 0;
      this.cuurentQues1 = 1;
      this.toastr.warning('Quiz 1 restarted', 'Progress Restarted');
    } else {
      if(this.cuurentQues1>=this.total){
        this.hideForm2 = false;
        this.exp2 = this.generateRandomExpression();
        this.quizForm2.setValue({ result2: '' });
        this.correctCounter2 = 0;
        this.cuurentQues2 = 1;
        this.toastr.warning('Quiz 2 restarted', 'Progress Restarted');
      }
      else{
      this.toastr.warning('Attempt is necessary for quiz 1 before starting quiz 2.', 'Please complete Quiz 1.');
      }
    }
  }
  currentStats(formNo: any): any {
    if (formNo == '1') {
      const msg = `Current Total Questions: ${this.cuurentQues1}, Current Correct Answered: ${this.correctCounter1}`;
      this.toastr.info(msg, 'Current Stas Quiz 1');
      console.log(this.allComputations);
    } else {
      const msg = `Current Total Questions : ${this.cuurentQues2}, Current Correct Answered: ${this.correctCounter2}`;
      this.toastr.info(msg, 'Current Stas Quiz 2');
      console.log(this.allComputations);
    }
  }
  startQuiz(formNo: any): any {
    this.enableEditPreference = false;
    if (!(this.totalForm.status.toUpperCase() == 'disabled'.toUpperCase())) {
      this.onSubmittotalForm(this.totalForm);
    }
    if (formNo == '1') {
      this.exp1 = this.generateRandomExpression();
      this.quizForm1 = this.fb.group({
        result1: ['', [Validators.required]],
      });
      this.showQuiz1 = true;
    } else {
      if(this.cuurentQues1>=this.total){
        this.exp2 = this.generateRandomExpression();
        
      this.quizForm2 = this.fb.group({
        result2: ['', [Validators.required]],
      });
      this.showQuiz2 = true;
      }
      else{
      this.toastr.warning('Attempt is necessary for quiz 1 before starting quiz 2.', 'Please complete Quiz 1.');
      }
    }
  }
}
