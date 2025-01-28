#include <stdio.h>
#include <iostream>
#include <assert.h>
#include "circom.hpp"
#include "calcwit.hpp"
void ToyRingSignature_0_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void ToyRingSignature_0_run(uint ctx_index,Circom_CalcWit* ctx);
Circom_TemplateFunction _functionTable[1] = { 
ToyRingSignature_0_run };
Circom_TemplateFunction _functionTableParallel[1] = { 
NULL };
uint get_main_input_signal_start() {return 2;}

uint get_main_input_signal_no() {return 12;}

uint get_total_signal_no() {return 20;}

uint get_number_of_components() {return 1;}

uint get_size_of_input_hashmap() {return 256;}

uint get_size_of_witness() {return 17;}

uint get_size_of_constants() {return 5;}

uint get_size_of_io_map() {return 0;}

uint get_size_of_bus_field_map() {return 0;}

void release_memory_component(Circom_CalcWit* ctx, uint pos) {{

if (pos != 0){{

if(ctx->componentMemory[pos].subcomponents)
delete []ctx->componentMemory[pos].subcomponents;

if(ctx->componentMemory[pos].subcomponentsParallel)
delete []ctx->componentMemory[pos].subcomponentsParallel;

if(ctx->componentMemory[pos].outputIsSet)
delete []ctx->componentMemory[pos].outputIsSet;

if(ctx->componentMemory[pos].mutexes)
delete []ctx->componentMemory[pos].mutexes;

if(ctx->componentMemory[pos].cvs)
delete []ctx->componentMemory[pos].cvs;

if(ctx->componentMemory[pos].sbct)
delete []ctx->componentMemory[pos].sbct;

}}


}}


// function declarations
// template declarations
void ToyRingSignature_0_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 0;
ctx->componentMemory[coffset].templateName = "ToyRingSignature";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 12;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[0];
}

void ToyRingSignature_0_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[3];
FrElement lvar[3];
uint sub_component_aux;
uint index_multiple_eq;
int cmp_index_ref_load = -1;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[2],&circuitConstants[3]); // line circom 16
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 13)];
// load src
Fr_add(&expaux[1],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 4)],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 1)]); // line circom 18
Fr_add(&expaux[0],&expaux[1],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 7)]); // line circom 18
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
printf("Step");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&lvar[2]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{
printf("sumVals[i]");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 13)]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{
PFrElement aux_dest = &signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 16)];
// load src
Fr_mul(&expaux[1],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 10)],&circuitConstants[0]); // line circom 23
Fr_sub(&expaux[0],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 13)],&expaux[1]); // line circom 23
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
printf("q[i]");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 10)]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{
printf("internalC[i]");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 16)]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{{
Fr_eq(&expaux[0],&signalValues[mySignalStart + ((1 * (Fr_toInt(&lvar[2]) + 1)) + 4)],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 16)]); // line circom 29
}}
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 29. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
{
printf("------------------------");
}
{
printf("\n");
}
{
PFrElement aux_dest = &lvar[2];
// load src
Fr_add(&expaux[0],&lvar[2],&circuitConstants[4]); // line circom 16
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[2],&circuitConstants[3]); // line circom 16
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 15];
// load src
Fr_add(&expaux[1],&signalValues[mySignalStart + 6],&signalValues[mySignalStart + 3]); // line circom 37
Fr_add(&expaux[0],&expaux[1],&signalValues[mySignalStart + 9]); // line circom 37
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
printf("Final sumVals");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + 15]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 18];
// load src
Fr_mul(&expaux[1],&signalValues[mySignalStart + 12],&circuitConstants[0]); // line circom 40
Fr_sub(&expaux[0],&signalValues[mySignalStart + 15],&expaux[1]); // line circom 40
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
printf("Final q");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + 12]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{
printf("Final internalC");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + 18]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{{
Fr_eq(&expaux[0],&signalValues[mySignalStart + 18],&signalValues[mySignalStart + 4]); // line circom 45
}}
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 45. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
{
printf("Final check:");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + 18]);
printf("%s",temp);
delete [] temp;
}
{
printf(" ");
}
{
printf("should equal");
}
{
printf(" ");
}
{
char* temp = Fr_element2str(&signalValues[mySignalStart + 4]);
printf("%s",temp);
delete [] temp;
}
{
printf("\n");
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[4]);
}
for (uint i = 0; i < 0; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void run(Circom_CalcWit* ctx){
ToyRingSignature_0_create(1,0,ctx,"main",0);
ToyRingSignature_0_run(0,ctx);
}

