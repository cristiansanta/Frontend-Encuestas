// src/containers/QuestionsForm.jsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import DOMPurify from 'dompurify';

import RichTextEditor       from '../components/RichTextEditor.jsx';
import SectionSelector      from '../components/SectionSelector.jsx';
import Modal                from '../components/Modal.jsx';
import ChildQuestionForm    from '../components/ChildQuestionForm.jsx';
import BankQuestionsDropdown from '../components/BankQuestionsDropdown.jsx';
import SavedQuestionForm    from './SavedQuestionForm.jsx';
import SwitchOption         from '../components/SwitchOption.jsx';
import QuestionTypeSelector from '../components/QuestionTypeSelector.jsx';
import QuestionPreview      from '../components/QuestionPreview.jsx';

import { getSections, getSelectedSection, saveSelectedSection } from '../services/SurveyFormStorage.js';
import {
  getBankQuestions,
  addQuestionToBank,
  removeSimilarQuestionFromBank,
  isSimilarQuestionInBank
} from '../services/BankQuestionsStorage.js';

import { isDescriptionNotEmpty } from '../utils/questionUtils.js';

import collapseExpandButton from '../assets/img/collapseExpandButton.svg';
import RefreshIcon          from '../assets/img/refresh.svg';
import DownIcon             from '../assets/img/down.svg';
import AddCategory1         from '../assets/img/AddCategory1.svg';

const QuestionsForm = forwardRef(({ onAddChildQuestion, ...props }, ref) => {
  const [title, setTitle]                   = useState('');
  const [description, setDescription]       = useState('');
  const [mandatory, setMandatory]           = useState(false);
  const [addToBank, setAddToBank]           = useState(false);
  const [isParentQuestion, setIsParentQuestion] = useState(false);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [errorMessage, setErrorMessage]     = useState('');
  const [modalStatus, setModalStatus]       = useState('default');
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [selectedSection, setSelectedSection]           = useState(null);
  const [availableSections, setAvailableSections]       = useState([]);
  const [isNewFormCollapsed, setIsNewFormCollapsed]     = useState(false);

  const [bankQuestions, setBankQuestions]   = useState([]);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  const [newChildForms, setNewChildForms]   = useState([]);
  const [newChildCompleted, setNewChildCompleted] = useState(true);
  const [childFormValidities, setChildFormValidities] = useState({});

  const [savedForms, setSavedForms]         = useState([]);
  const [formKey, setFormKey]               = useState(`form_${Date.now()}`);

  const bankButtonRef = useRef(null);
  const childFormRefs = useRef({});

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';

  // Carga inicial
  useEffect(() => {
    const secs = getSections();
    setAvailableSections(secs.length ? secs : [
      { id:1, name:'Información Personal' },
      { id:2, name:'Experiencia Laboral' },
      { id:3, name:'Académica' }
    ]);

    const sel = getSelectedSection();
    if (sel) {
      const full = secs.find(s=>s.id===sel.id);
      setSelectedSection(full||null);
    }

    setBankQuestions(getBankQuestions());

    window.addEventListener('storage', e => {
      if (e.key==='survey_sections') setAvailableSections(getSections());
      if (e.key==='selected_survey_section_id') {
        const ss = getSelectedSection();
        setSelectedSection(getSections().find(s=>s.id===ss?.id)||null);
      }
      if (e.key==='bank_questions') setBankQuestions(getBankQuestions());
    });

    window.addEventListener('sectionRemoved', e => {
      setAvailableSections(e.detail.updatedSections);
      if (selectedSection?.id===e.detail.id) {
        setSelectedSection(null);
        saveSelectedSection(null);
      }
    });
    window.addEventListener('bankQuestionsUpdated', e => setBankQuestions(e.detail));

    return () => {
      window.removeEventListener('storage', ()=>{});
      window.removeEventListener('sectionRemoved', ()=>{});
      window.removeEventListener('bankQuestionsUpdated', ()=>{});
    };
  }, []);

  useEffect(() => {
    if (!isParentQuestion) {
      setNewChildForms([]);
      setNewChildCompleted(true);
    }
  }, [isParentQuestion]);

  const hasNewFormChanges =
    !!selectedQuestionType ||
    !!selectedSection ||
    title.trim() !== '' ||
    isDescriptionNotEmpty(description);

  const canActivateNewSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null &&
    selectedSection !== null &&
    isDescriptionNotEmpty(description);

  // Guards child validity
  const handleChildValidityChange = (id, valid) => {
    setChildFormValidities(v => ({ ...v, [id]: valid }));
  };

  // Handlers para savedForms
  const toggleSavedCollapse = id => {
    setSavedForms(f => f.map(x => x.id===id ? { ...x, isCollapsed: !x.isCollapsed } : x));
  };
  const updateSavedForm = (id, data) => {
    setSavedForms(f => f.map(x => x.id===id ? { ...x, ...data } : x));
  };
  const deleteSavedForm = id => {
    setSavedForms(f => f.filter(x=>x.id!==id));
    setModalStatus('success');
    setErrorMessage('Pregunta eliminada.');
    setIsModalOpen(true);
  };

  // Añadir hijo en saved
  const addChildToSaved = parentId => {
    const childId = `child_${Date.now()}`;
    setSavedForms(f => f.map(x => {
      if (x.id===parentId) {
        const parentData = {
          id: x.serverId||x.id,
          title: x.title,
          description: x.description,
          questionType: x.questionType,
          section: x.section,
          mandatory: x.mandatory
        };
        return {
          ...x,
          isParentQuestion: true,
          childForms: [...(x.childForms||[]), {
            id: childId,
            parentData,
            completed: false,
            isCollapsed: false,
            data: null
          }]
        };
      }
      return x;
    }));
  };

  const updateChildInSaved = (parentId, childId, childData) => {
    setSavedForms(f => f.map(x => {
      if (x.id===parentId) {
        return {
          ...x,
          childForms: x.childForms.map(c => c.id===childId
            ? { ...c, data: childData, completed: true, isCollapsed: true }
            : c
          )
        };
      }
      return x;
    }));
  };

  const removeChildFromSaved = (parentId, childId) => {
    setSavedForms(f => f.map(x => {
      if (x.id===parentId) {
        return { ...x, childForms: x.childForms.filter(c=>c.id!==childId) };
      }
      return x;
    }));
    setModalStatus('info');
    setErrorMessage('Pregunta hija eliminada.');
    setIsModalOpen(true);
  };

  // Bank switch for new form
  const handleNewBankSwitch = () => {
    if (!canActivateNewSwitches) return;
    const q = { title: title.trim(), questionType: selectedQuestionType };
    if (!addToBank) {
      if (isSimilarQuestionInBank(q)) {
        setModalStatus('info');
        setErrorMessage('Ya existe una pregunta similar en el banco.');
        setIsModalOpen(true);
        return;
      }
      addQuestionToBank({ id: Date.now(), title: title.trim(), description, questionType: selectedQuestionType, section: selectedSection, mandatory, isParentQuestion });
      setAddToBank(true);
    } else {
      removeSimilarQuestionFromBank(q);
      setAddToBank(false);
    }
  };

  // Reset nuevo form
  const resetNewForm = () => {
    setTitle('');
    setDescription('');
    setSelectedQuestionType(null);
    setSelectedSection(null);
    setMandatory(false);
    setAddToBank(false);
    setIsParentQuestion(false);
    setNewChildForms([]);
    setNewChildCompleted(true);
    setIsNewFormCollapsed(false);
    setFormKey(`form_${Date.now()}`);
    saveSelectedSection(null);
  };

  // Importar/resetear
  const handleImportOrReset = () => {
    hasNewFormChanges ? resetNewForm() : setIsBankDropdownOpen(true);
  };

  // Añadir nueva hija en NEW form
  const handleAddNewChild = () => {
    if (!selectedQuestionType || !title.trim() || !selectedSection) {
      setModalStatus('error');
      setErrorMessage('Completa todos los campos antes de agregar hija.');
      setIsModalOpen(true);
      return;
    }
    const parentData = {
      id: formKey,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory
    };
    const childId = `new_child_${Date.now()}`;
    setNewChildForms(prev => [...prev, { id: childId, parentData, completed: false, data: null }]);
    setNewChildCompleted(false);
    setIsNewFormCollapsed(false);
  };

  const handleSaveNewChild = (childId, childData) => {
    setNewChildForms(prev => prev.map(c =>
      c.id===childId ? { ...c, data: childData, completed: true, isCollapsed: true } : c
    ));
    setNewChildCompleted(true);
    setModalStatus('success');
    setErrorMessage('Pregunta hija agregada.');
    setIsModalOpen(true);
  };

  const handleCancelNewChild = (childId) => {
    setNewChildForms(prev => prev.filter(c=>c.id!==childId));
    setNewChildCompleted(newChildForms.every(c=>c.completed));
  };

  // Submit new form
  const handleSubmit = async () => {
    if (!title.trim() || !isDescriptionNotEmpty(description) || !selectedQuestionType || !selectedSection) {
      setModalStatus('error');
      setErrorMessage('Título, descripción, tipo y sección son requeridos.');
      setIsModalOpen(true);
      return;
    }
    const cleanTitle = DOMPurify.sanitize(title.trim());
    const cleanDesc  = DOMPurify.sanitize(description);
    const parentPayload = {
      title: cleanTitle,
      descrip: cleanDesc,
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: 0,
      bank: addToBank,
      type_questions_id: selectedQuestionType,
      section_id: selectedSection.id,
      questions_conditions: isParentQuestion,
      creator_id: 1
    };

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(parentPayload)
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const serverId = data.id;

      // Prepara saved entry
      const entry = {
        id: formKey,
        serverId,
        title: cleanTitle,
        description: cleanDesc,
        questionType: selectedQuestionType,
        section: selectedSection,
        mandatory,
        isParentQuestion,
        addToBank,
        isCollapsed: true,
        childForms: newChildForms
          .filter(c=>c.completed&&c.data)
          .map(c=>({
            id: c.id,
            parentData: { ...c.parentData, id:serverId, serverId },
            completed:true,
            isCollapsed:true,
            data:c.data
          }))
      };

      if (addToBank) {
        addQuestionToBank({ ...entry, id:serverId });
      }

      setSavedForms(prev=>[...prev, entry]);
      resetNewForm();
      setModalStatus('success');
      setErrorMessage('Pregunta agregada correctamente.');
      setIsModalOpen(true);
    } catch (err) {
      setModalStatus('error');
      setErrorMessage(`Error al guardar: ${err.message}`);
      setIsModalOpen(true);
    }
  };

  useImperativeHandle(ref, () => ({
    submitQuestionForm: handleSubmit,
    addQuestion: handleSubmit
  }));

  return (
    <>
      {savedForms.map(f => (
        <SavedQuestionForm
          key={f.id}
          form={f}
          onToggleCollapse={toggleSavedCollapse}
          onUpdate={updateSavedForm}
          onDeleteForm={deleteSavedForm}
          onAddChildQuestion={addChildToSaved}
          onUpdateChildInSavedForm={updateChildInSaved}
          onRemoveChildFromSavedForm={removeChildFromSaved}
        />
      ))}

      {/* Nuevo formulario */}
      <div key={formKey} className="mb-6">
        <div className={`flex flex-col gap-4 ${isNewFormCollapsed ? 'py-2 px-6 h-15 overflow-hidden' : 'p-6'} rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out`} style={isNewFormCollapsed ? { minHeight:'50px' } : {}}>
          <div className="flex items-center justify-between">
            <div className="w-2/3 relative pr-4">
              <input
                type="text" value={title}
                onChange={e=>setTitle(e.target.value)}
                placeholder="Título de Pregunta"
                maxLength={50}
                className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full bg-transparent focus:outline-none ${isNewFormCollapsed ? 'py-1' : 'pb-1'} ${(!isNewFormCollapsed||title==='')?'border-b-2 border-gray-300 focus:border-blue-custom':'border-b-2 border-transparent'}`}
                readOnly={isNewFormCollapsed}
              />
              {!isNewFormCollapsed && <div className="absolute right-4 bottom-1 text-xs text-gray-500">{title.length}/50</div>}
            </div>

            <div className="flex items-center gap-3">
              {!isNewFormCollapsed && (
                <button ref={bankButtonRef} onClick={handleImportOrReset} className="flex items-center bg-blue-custom rounded-full overflow-hidden transition-all duration-300 hover:shadow-md">
                  <span className="bg-blue-custom text-white px-4 py-1"><img src={hasNewFormChanges ? RefreshIcon : DownIcon} alt="Reset/Import" className="w-5 h-5"/></span>
                  <span className="bg-yellow-custom px-4 py-1"><span className="font-work-sans text-sm font-semibold text-blue-custom whitespace-nowrap">{hasNewFormChanges ? 'Volver a empezar' : 'Importar desde el Banco'}</span></span>
                </button>
              )}
              <button onClick={()=>setIsNewFormCollapsed(!isNewFormCollapsed)} className="focus:outline-none transform transition-transform duration-300 hover:opacity-80" style={{ transform: isNewFormCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <img src={collapseExpandButton} alt="Toggle" className="w-7 h-7"/>
              </button>
            </div>
          </div>

          {!isNewFormCollapsed && (
            <>
              <div className="mb-4">
                <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Tipo de pregunta</h2>
                <QuestionTypeSelector
                  selectedType={selectedQuestionType}
                  onSelect={setSelectedQuestionType}
                  disabled={false}
                />
              </div>

              <div className="mb-4">
                <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Sección</h2>
                <SectionSelector
                  initialSelectedSection={selectedSection}
                  onSectionSelect={sec=>{ setSelectedSection(sec); saveSelectedSection(sec?.id||null); }}
                />
              </div>

              <div className="mb-4">
                <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción</h2>
                <RichTextEditor value={description} onChange={setDescription}/>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 py-2">
                <SwitchOption value={isParentQuestion} onChange={()=>setIsParentQuestion(!isParentQuestion)} label="Convertir en pregunta madre" disabled={!canActivateNewSwitches}/>
                <SwitchOption value={mandatory} onChange={()=>setMandatory(!mandatory)} label="¿Es obligatoria?" disabled={!canActivateNewSwitches}/>
                <SwitchOption value={addToBank} onChange={handleNewBankSwitch} label="Añadir al banco" disabled={!canActivateNewSwitches}/>
              </div>

              <QuestionPreview typeId={selectedQuestionType} />
            </>
          )}

          <Modal
            isOpen={isModalOpen}
            title={modalStatus==='error'?'Error':modalStatus==='info'?'Información':'Éxito'}
            message={DOMPurify.sanitize(errorMessage)}
            onConfirm={()=>setIsModalOpen(false)}
            onCancel={()=>setIsModalOpen(false)}
            status={modalStatus}
            confirmText="Cerrar"
          />

          <BankQuestionsDropdown
            isOpen={isBankDropdownOpen}
            onOpenChange={setIsBankDropdownOpen}
            onQuestionSelect={q=>{/* importar lógica */}}
            onCancel={()=>setIsBankDropdownOpen(false)}
            anchorRef={bankButtonRef}
          />
        </div>

        {isParentQuestion && (
          <div className="mt-1">
            {newChildForms.map(c => (
              <div key={c.id} className="mt-2">
                {c.completed
                  ? <SavedQuestionForm
                      form={c}
                      onToggleCollapse={()=>{}}
                      onUpdate={(id,data)=>{}}
                      onDeleteForm={()=>handleCancelNewChild(c.id)}
                      onAddChildQuestion={()=>{}}
                      onUpdateChildInSavedForm={(pid,cid,data)=>handleSaveNewChild(cid,data)}
                      onRemoveChildFromSavedForm={()=>handleCancelNewChild(c.id)}
                    />
                  : <ChildQuestionForm
                      ref={el=>childFormRefs.current[c.id]=el}
                      formId={c.id}
                      parentQuestionData={c.parentData}
                      onSave={(data)=>handleSaveNewChild(c.id,data)}
                      onCancel={()=>handleCancelNewChild(c.id)}
                      onValidityChange={valid=>handleChildValidityChange(c.id,valid)}
                    />
                }
              </div>
            ))}

            <div className="mt-3 flex justify-end">
              <button onClick={handleAddNewChild} disabled={!canActivateNewSwitches}
                className={`w-5/6 py-2.5 rounded-xl flex items-center justify-start pl-6 gap-2 shadow-sm hover:shadow-md ${canActivateNewSwitches ? 'bg-yellow-custom' : 'bg-gray-200 cursor-not-allowed'}`}>
                <span className={`font-work-sans text-2xl font-bold ${canActivateNewSwitches ? 'text-blue-custom' : 'text-gray-500'}`}>
                  Agregar pregunta hija
                </span>
                <img src={AddCategory1} alt="Agregar" className="w-8 h-8"/>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <button onClick={handleSubmit} disabled={!canActivateNewSwitches}
          className={`w-full py-3 rounded-xl flex items-center justify-start pl-6 gap-2 shadow-sm hover:shadow-md ${canActivateNewSwitches ? 'bg-yellow-custom hover:bg-yellow-400' : 'bg-gray-200 cursor-not-allowed'}`}>
          <span className={`font-work-sans text-2xl font-bold ${canActivateNewSwitches ? 'text-blue-custom' : 'text-gray-500'}`}>
            Agregar pregunta
          </span>
          <img src={AddCategory1} alt="Agregar" className="w-8 h-8"/>
        </button>
      </div>
    </>
  );
});

export default QuestionsForm;
