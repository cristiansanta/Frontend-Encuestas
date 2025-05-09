// src/containers/SavedQuestionForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import Modal from '../components/Modal.jsx';
import SectionSelector from '../components/SectionSelector.jsx';
import ChildQuestionForm from '../components/ChildQuestionForm.jsx';
import BankQuestionsDropdown from '../components/BankQuestionsDropdown.jsx';
import SwitchOption from '../components/SwitchOption.jsx';
import QuestionTypeSelector from '../components/QuestionTypeSelector.jsx';
import { questionTypes, isDescriptionNotEmpty } from '../utils/questionUtils.js';
import {
  addQuestionToBank,
  removeSimilarQuestionFromBank,
  isSimilarQuestionInBank
} from '../services/BankQuestionsStorage.js';

import collapseExpandButton from '../assets/img/collapseExpandButton.svg';
import trashcanIcon         from '../assets/img/trashCan_1.svg';
import downIcon             from '../assets/img/down.svg';
import AddCategory1 from '../assets/img/AddCategory1.svg';

const SavedQuestionForm = ({
  form,
  onToggleCollapse,
  onUpdate,
  onAddChildQuestion,
  onDeleteForm,
  onUpdateChildInSavedForm,
  onRemoveChildFromSavedForm
}) => {
  const [isEditing, setIsEditing] = useState(!form.isCollapsed);
  const [title, setTitle]               = useState(form.title || '');
  const [description, setDescription]   = useState(form.description || '');
  const [selectedQuestionType, setSelectedQuestionType] = useState(form.questionType);
  const [selectedSection, setSelectedSection]           = useState(form.section);
  const [mandatory, setMandatory]       = useState(form.mandatory || false);
  const [isParentQuestionState, setIsParentQuestionState] = useState(form.isParentQuestion || false);
  const [addToBank, setAddToBank]       = useState(form.addToBank || false);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalStatus, setModalStatus]   = useState('default');
  const childFormRefs = useRef({});
  const bankButtonRef = useRef(null);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [childFormValidities, setChildFormValidities] = useState({});

  useEffect(() => {
    setTitle(form.title || '');
    setDescription(form.description || '');
    setSelectedQuestionType(form.questionType);
    setSelectedSection(form.section);
    setMandatory(form.mandatory || false);
    setIsParentQuestionState(form.isParentQuestion || false);
    setAddToBank(form.addToBank || false);
  }, [form]);

  useEffect(() => {
    setIsEditing(!form.isCollapsed);
  }, [form.isCollapsed]);

  const canActivateSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null &&
    selectedSection !== null &&
    isDescriptionNotEmpty(description);

  const saveParentChanges = () => {
    const updated = {
      ...form,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory,
      isParentQuestion: isParentQuestionState,
      addToBank
    };
    onUpdate(form.id, updated);
  };

  const handleBankSwitchChange = () => {
    if (!canActivateSwitches || !isEditing) return;
    const newVal = !addToBank;
    setAddToBank(newVal);

    const questionData = {
      title: title.trim(),
      questionType: selectedQuestionType
    };

    if (newVal) {
      if (isSimilarQuestionInBank(questionData)) {
        setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
        setModalStatus('info');
        setIsModalOpen(true);
        setAddToBank(false);
        return;
      }
      const res = addQuestionToBank({ ...form, title: title.trim(), questionType: selectedQuestionType });
      if (!res.success) {
        setErrorMessage('Error al guardar en el banco.');
        setModalStatus('error');
        setIsModalOpen(true);
        setAddToBank(false);
      }
    } else {
      removeSimilarQuestionFromBank(questionData);
    }
  };

  const handleAddChild = () => {
    if (!selectedQuestionType || !title.trim() || !selectedSection) {
      setErrorMessage('Debe completar título, tipo y sección antes de agregar hija.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }
    if (!form.isCollapsed && isEditing) saveParentChanges();
    onAddChildQuestion(form.id);
  };

  const closeModal = () => setIsModalOpen(false);

  const childForms = form.childForms || [];

  return (
    <div className="mb-6">
      <div className={`flex flex-col gap-4 ${form.isCollapsed ? 'py-2 px-6 h-15 overflow-hidden' : 'p-6'} rounded-xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={form.isCollapsed ? { minHeight: '50px' } : {}}>
        {/* Cabecera */}
        <div className="flex items-center">
          <div className="w-2/3 relative pr-4">
            <input
              type="text"
              value={title}
              onChange={e => isEditing && !form.isCollapsed && setTitle(e.target.value)}
              placeholder="Título de Pregunta"
              maxLength={50}
              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full bg-transparent focus:outline-none ${form.isCollapsed ? 'py-1' : 'pb-1'} ${isEditing && !form.isCollapsed ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
              readOnly={!isEditing || form.isCollapsed}
            />
            {!form.isCollapsed && <div className="absolute right-4 bottom-1 text-xs text-gray-500">{title.length}/50</div>}
          </div>

          <div className="w-1/3 flex items-center justify-end gap-3">
            <button onClick={() => onDeleteForm(form.id)} className="focus:outline-none hover:opacity-80">
              <img src={trashcanIcon} alt="Eliminar" className="w-7 h-7" />
            </button>

            {!form.isCollapsed && (
              <button
                ref={bankButtonRef}
                onClick={() => isEditing && setIsBankDropdownOpen(true)}
                disabled={!isEditing}
                className={`flex items-center bg-blue-custom rounded-full overflow-hidden transition-all duration-300 hover:shadow-md ${!isEditing ? 'opacity-50' : ''}`}
              >
                <span className="bg-blue-custom text-white px-4 py-1"><img src={downIcon} alt="Importar" className="w-5 h-5" /></span>
                <span className="bg-yellow-custom px-4 py-1"><span className="font-work-sans text-sm font-semibold text-blue-custom whitespace-nowrap">Importar desde el Banco</span></span>
              </button>
            )}

            <button onClick={() => { if (!form.isCollapsed && isEditing) saveParentChanges(); onToggleCollapse(form.id); }}
              className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
              style={{ transform: form.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <img src={collapseExpandButton} alt="Toggle" className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Contenido expandido */}
        {!form.isCollapsed && (
          <>
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Tipo de pregunta</h2>
              <QuestionTypeSelector
                selectedType={selectedQuestionType}
                onSelect={type => isEditing && setSelectedQuestionType(type)}
                disabled={!isEditing}
              />
            </div>

            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Sección</h2>
              <SectionSelector
                initialSelectedSection={selectedSection}
                onSectionSelect={section => isEditing && setSelectedSection(section)}
                disabled={!isEditing}
                key={selectedSection ? `section-${selectedSection.id}-${form.id}` : `no-section-${form.id}`}
              />
            </div>

            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción</h2>
              {isEditing
                ? <RichTextEditor value={description} onChange={v => setDescription(v)} />
                : <div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
              }
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 py-2">
              <SwitchOption
                value={isParentQuestionState}
                onChange={() => { if (isEditing && canActivateSwitches) setIsParentQuestionState(!isParentQuestionState); }}
                label="Convertir en pregunta madre"
                disabled={!canActivateSwitches || !isEditing}
              />
              <SwitchOption
                value={mandatory}
                onChange={() => isEditing && setMandatory(!mandatory)}
                label="¿Es obligatoria?"
                disabled={!canActivateSwitches || !isEditing}
              />
              <SwitchOption
                value={addToBank}
                onChange={handleBankSwitchChange}
                label="Añadir al banco"
                disabled={!canActivateSwitches || !isEditing}
              />
            </div>
          </>
        )}

        <Modal
          isOpen={isModalOpen}
          title={modalStatus === 'error' ? 'Error' : modalStatus === 'info' ? 'Información' : 'Éxito'}
          message={DOMPurify.sanitize(errorMessage)}
          onConfirm={closeModal}
          onCancel={closeModal}
          status={modalStatus}
          confirmText="Cerrar"
        />

        <BankQuestionsDropdown
          isOpen={isBankDropdownOpen}
          onOpenChange={setIsBankDropdownOpen}
          onQuestionSelect={q => { setSelectedQuestionType(q.questionType); /* ... */ }}
          onCancel={() => setIsBankDropdownOpen(false)}
          anchorRef={bankButtonRef}
        />
      </div>

      {/* Hijas y botón Agregar */}
      {isParentQuestionState && (
        <div className="mt-1">
          {childForms.length > 0 && childForms.map(child => (
            <div key={child.id} className="mt-2">
              {child.completed
                ? /* renderizado de hija completada (similar al padre) */
                  <SavedQuestionForm
                    form={child}
                    onToggleCollapse={onUpdate}
                    onUpdate={onUpdateChildInSavedForm}
                    onDeleteForm={() => onRemoveChildFromSavedForm(form.id, child.id)}
                    onAddChildQuestion={() => {}}
                    onUpdateChildInSavedForm={() => {}}
                    onRemoveChildFromSavedForm={() => {}}
                  />
                : <ChildQuestionForm
                    ref={el => (childFormRefs.current[child.id] = el)}
                    formId={child.id}
                    parentQuestionData={child.parentData}
                    onSave={data => onUpdateChildInSavedForm(form.id, child.id, data)}
                    onCancel={() => onRemoveChildFromSavedForm(form.id, child.id)}
                    onValidityChange={(valid) => setChildFormValidities(v => ({ ...v, [child.id]: valid }))}
                  />
              }
            </div>
          ))}

          <div className="mt-3 flex justify-end">
            <button onClick={handleAddChild} disabled={!canActivateSwitches}
              className={`w-5/6 py-2.5 rounded-xl flex items-center justify-start pl-6 gap-2 shadow-sm hover:shadow-md ${canActivateSwitches ? 'bg-yellow-custom' : 'bg-gray-200 cursor-not-allowed'}`}>
              <span className={`font-work-sans text-2xl font-bold ${canActivateSwitches ? 'text-blue-custom' : 'text-gray-500'}`}>
                Agregar pregunta hija
              </span>
              <img src={AddCategory1} alt="Agregar" className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedQuestionForm;
